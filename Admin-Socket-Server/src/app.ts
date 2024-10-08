import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { SocketKeyName, WebSocket } from "./Socket";
import { Redis } from "./redis";
import { SecrtKey } from "./env";
import os from 'os';

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
const _Redis = new Redis();
const ConnectRedis = async () => {
    await _Redis.connect();
};

ConnectRedis();
export const runChat = async () => {
    // await _Redis.connect(); // Ensure Redis connection here
    Socket.getChatMessage(
        SocketKeyName.SendMessage,
        async (res: any) => {
            // Socket.SendChatMessageInRoom(SocketKeyName.ReceiveMessage, res);
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


        Socket.SendChatMessageInRoom(SocketKeyName.ReceiveMessage, mess);
    },
    (err) => {
        Socket.SendChatMessageInRoom(SocketKeyName.ReceiveError, err);
    }
);

app.get('/', (req, res) => {
    const userInfo = os.userInfo();
    const systemInfo = {
        user: userInfo.username,
        hostname: os.hostname(),
        platform: os.platform(),
        architecture: os.arch(),
        osType: os.type(),
        osRelease: os.release(),
        uptime: os.uptime(),
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        cpus: os.cpus(),
        homeDir: os.homedir(),
        tmpDir: os.tmpdir(),
        networkInterfaces: os.networkInterfaces(),
        endianness: os.endianness(),
    };
    res.json(systemInfo);
});



// Start the HTTP server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
