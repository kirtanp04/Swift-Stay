import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { SocketKeyName, WebSocket } from "./Socket";
import { Redis } from "./redis";
import { SecrtKey } from "./env";

dotenv.config();
const port = process.env.PORT || 5001;

const app = express();

app.use(
    cors({
        credentials: true,
        methods: "GET,POST",
        origin: SecrtKey.FRONTEND_URL,
    })
);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        credentials: true,
        methods: "GET,POST",
        origin: SecrtKey.FRONTEND_URL,
    },
});

const Socket = new WebSocket(io);
const _Redis = new Redis();

const ConnectRedis = async () => {
    await _Redis.connect();
};

ConnectRedis();

export const runChat = async () => {

    Socket.getChatMessage(
        SocketKeyName.SendMessage,
        async (res: any) => {


            await _Redis.publish(
                res,
                () => {
                    Socket.SendChatMessageInRoom(SocketKeyName.ReceiveMessage, res);
                },
                (err) => {
                    Socket.SendChatMessageInRoom(SocketKeyName.ReceiveError, err);
                }
            );
        },
        (err: any) => {
            Socket.SendChatMessageInRoom(SocketKeyName.ReceiveError, err);
        }
    );


};

_Redis.subscribe(
    (mess) => {


        console.log(mess)

        Socket.SendChatMessageInRoom(SocketKeyName.ReceiveMessage, mess);
    },
    (err) => {
        Socket.SendChatMessageInRoom(SocketKeyName.ReceiveError, err);
    }
);

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
