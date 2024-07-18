import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { SocketKeyName, WebSocket } from "./Socket";



const port = process.env.PORT || 5000;

dotenv.config({
    path: "../.env",
});

const app = express();

app.use(
    cors({
        credentials: true,
        methods: "GET,POST",
        optionsSuccessStatus: 201,
        origin: "http://localhost:5173",
    })
);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        credentials: true,
        methods: "GET,POST",
        optionsSuccessStatus: 201,
        origin: "http://localhost:5173",
    },
});

const Socket = new WebSocket(io);


export const runChat = () => {
    Socket.getChatMessage(
        SocketKeyName.SendMessage,
        (res) => {
            Socket.SendChatMessageInRoom(SocketKeyName.ReceiveMessage, res);
        },
        (err) => {
            Socket.SendChatMessageInRoom(SocketKeyName.ReceiveError, err);
        }
    );
};

// Start the HTTP server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
