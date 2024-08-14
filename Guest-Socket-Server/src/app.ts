import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { SocketKeyName, WebSocket } from "./Socket";

dotenv.config({
    path: "../.env",
});

const port = process.env.PORT || 5001;

const app = express();

// Use CORS with proper configuration
app.use(cors({
    credentials: true,
    methods: "GET,POST",
    origin: "http://localhost:5173",
}));

// Create HTTP server and pass it to Socket.io
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        credentials: true,
        methods: "GET,POST",
        origin: "http://localhost:5173",
    },
});

// Initialize WebSocket with Socket.io instance
const Socket = new WebSocket(io);

export const runChat = () => {
    Socket.getChatMessage(
        SocketKeyName.SendMessage,
        (res: any) => {
            console.log(res);
            Socket.SendChatMessageInRoom(SocketKeyName.ReceiveMessage, res);
        },
        (err: any) => {
            Socket.SendChatMessageInRoom(SocketKeyName.ReceiveError, err);
        }
    );
};

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
