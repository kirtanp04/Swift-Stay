import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import { WebSocket } from './Socket';

dotenv.config({
    path: '../.env'
});

const app = express();

app.use(cors({
    credentials: true,
    methods: 'GET,POST',
    optionsSuccessStatus: 201,
    origin: 'http://localhost:5173',
}));

// Create an HTTP server and pass the Express app
const server = http.createServer(app);

// Initialize the Socket.IO server with the HTTP server
const io = new Server(server, {
    cors: {
        credentials: true,
        methods: 'GET,POST',
        optionsSuccessStatus: 201,
        origin: 'http://localhost:5173',
    }
});

new WebSocket(io)



const port = process.env.PORT || 5050;

app.get('/', (req, res) => {
    res.send('Hello, TypeScript with Express!');
});

// Start the HTTP server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
