import http from 'http';
import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Crypt } from './common/index';



export class SocketUserAuth {
    name: string = '';
    email: string = '';
    _id: string = '';
}

export interface CustomSocket extends Socket {
    userDetail?: SocketUserAuth;
}


export class WebSocket {

    private io: Server;

    constructor(SocketServer: Server) {

        this.io = SocketServer
        // this.MiddleWare();
        this.HandleConnections();
    }

    private MiddleWare = () => {
        this.io.use((socket: CustomSocket, next) => {
            const userInfo = socket.handshake.auth.userInfo;
            const userData = Crypt.Decryption(userInfo);
            if (userData.error === '') {
                socket.userDetail = userData.data;
                next();
            } else {
                next(new Error('Authentication error'));
            }
        });

    };

    private HandleConnections = () => {
        this.io.on('connection', (socket: CustomSocket) => {
            console.log('User connected:');

            socket.on('Join_Room', (roomKey: string) => {
                console.log('key', roomKey)
                socket.join(roomKey);
                this.io.to(roomKey).emit('roomJoined');
            });

            socket.on('SendMessage', (encryptedMessage: string) => {
                const decryptedMessage = Crypt.Decryption(encryptedMessage);
                console.log('Message', decryptedMessage.data)
                if (decryptedMessage.error === '') {
                    this.io.to(decryptedMessage.data).emit('message', decryptedMessage.data);
                } else {
                    console.log('Failed to decrypt message');
                }
            });

            socket.on('disconnect', () => {
                console.log('User disconnected:');
            });


        });
    };
}

// Initialize the WebSocket server on port 3000
// new WebSocket(3000);


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
