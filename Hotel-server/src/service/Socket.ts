import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Crypt } from '../common';
import { enumUserRole } from '../models/UserModel';
import { SecrtKey } from '../env';

export class SocketUserAuth {
    name: string = '';
    email: string = '';
    role: enumUserRole = enumUserRole.guest;
    _id: string = '';
}

export interface CustomSocket extends Socket {
    UserInfo?: SocketUserAuth;
}

export class WebSocket {
    private HtttpServer = createServer();
    private IO: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null = null;
    private JoinroomsocketName: string = 'Join_Room';

    constructor() {
        const IO = this.CreateSocketServer();
        this.IO = IO;
        // this.MiddleWare();
        this.HandleConnections();
    }

    private CreateSocketServer = (): Server => {
        const IO = new Server(this.HtttpServer);
        return IO;
    }

    private MiddleWare = (): void => {
        try {
            this.IO?.use((socket: CustomSocket, next) => {
                const token: string = socket.handshake.auth.UserInfo;
                const decryptedObj = Crypt.Decryption(token);
                if (decryptedObj.error === '') {
                    socket.UserInfo = decryptedObj.data;
                    next();
                } else {
                    next(new Error('You are not Authenticated For Using Chat Service. Login to perform this task.'));
                }
            });
        } catch (error: any) {
            console.log({ soccket_Middleware_error: error.message });
        }
    }

    private IsRoomAlreadyThere = (roomKey: string): boolean => {
        const Rooms = this.IO?.sockets.adapter.rooms;
        return Rooms ? Rooms.has(roomKey) : false;
    }

    private HandleConnections = (): void => {
        try {
            this.IO?.on('connection', (socket: CustomSocket) => {
                console.log(`User Connected -> UserName: ${socket.UserInfo?.name} / Email:${socket.UserInfo?.email} / Role:${socket.UserInfo?.role}`);

                socket.on(this.JoinroomsocketName, (roomKey: string) => {
                    if (this.IsRoomAlreadyThere(roomKey)) {
                        console.log(`User ${socket.UserInfo?.name} is joining existing room: ${roomKey}`);
                        socket.join(roomKey);
                        socket.emit('roomJoined', `Joined existing room: ${roomKey}`);
                    } else {
                        console.log(`User ${socket.UserInfo?.name} is creating and joining new room: ${roomKey}`);
                        socket.join(roomKey);
                        socket.emit('roomCreated', `Created and joined new room: ${roomKey}`);
                    }
                });

                socket.on('message', (objChat: ChatObj) => {
                    console.log(`Message from ${socket.UserInfo?.name}: ${objChat}`);
                    this.IO?.to(objChat.key).emit('message', objChat);
                });

                socket.on('disconnect', () => {
                    console.log(`User disconnected: ${socket.UserInfo?.name}`);
                });

            });
        } catch (error: any) {
            console.log({ soccket_Handel_error: error.message });
        }
    }

    public Start = (port: number): void => {
        this.HtttpServer.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    }
}

export class ChatObj {
    message: string = '';
    date: Date | string = new Date();
    key: string = '';
    senderDetail: Sender = new Sender();
}

class Sender {
    id: string = '';
    email: string = '';
    name: string = '';
    profileImg: string = '';
}
