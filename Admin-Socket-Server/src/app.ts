import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { SocketKeyName, WebSocket } from "./Socket";
import { Redis } from "./redis";
import { SecrtKey } from "./env";




const port = process.env.PORT || 5000;



const app = express();
app.use(
    cors({
        credentials: true,
        methods: "GET,POST",
        optionsSuccessStatus: 201,
        origin: SecrtKey.FRONTEND_URL,
    })
);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        credentials: true,
        methods: "GET,POST",
        optionsSuccessStatus: 201,
        origin: SecrtKey.FRONTEND_URL,
    },
});

const Socket = new WebSocket(io);
const _Redis = new Redis()

const ConnectRedis = async () => {
    await _Redis.connect()
}
ConnectRedis()


export const runChat = () => {
    Socket.getChatMessage(
        SocketKeyName.SendMessage,
        async (res) => {
            Socket.SendChatMessageInRoom(SocketKeyName.ReceiveMessage, res);
            await _Redis.publish(res, (err) => {
                console.log(err)
                Socket.SendChatMessageInRoom(SocketKeyName.ReceiveError, err);
            })


        },
        (err) => {
            Socket.SendChatMessageInRoom(SocketKeyName.ReceiveError, err);
        }
    );
};


_Redis.subscribe((mess) => {
    console.log(mess)
    Socket.SendChatMessageInRoom(SocketKeyName.ReceiveMessage, mess)
}, (err) => {
    Socket.SendChatMessageInRoom(SocketKeyName.ReceiveError, err);
})



// Start the HTTP server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});