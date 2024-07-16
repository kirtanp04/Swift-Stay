import http from 'http';
import { Server, Socket } from 'socket.io';
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
    private ActiveRoom: string = ''
    constructor(SocketServer: Server) {
        this.io = SocketServer;
        this.HandleConnections();
    }

    private HandleConnections = () => {
        this.io.on('connection', (socket: CustomSocket) => {
            console.log('User connected:', socket.id);

            socket.on('Join_Room', (roomKey: string) => {
                // decrypting key 
                const objDecryptKey: ChatObj = Crypt.Decryption(roomKey).data
                console.log('Joining room:', roomKey);
                socket.join(objDecryptKey.key);

                if (this.ActiveRoom === objDecryptKey.key) {

                    const chatMess = new ChatObj();
                    chatMess.date = `${objDecryptKey.senderDetail.name} is live now`;
                    const encryptMess = Crypt.Encryption(chatMess).data;
                    console.log('Emitting roomJoined event to room:', roomKey);
                    socket.to(objDecryptKey.key).emit('roomJoined', encryptMess);
                }

                this.ActiveRoom = objDecryptKey.key
            });

            socket.on('SendMessage', (encryptedMessage: string) => {
                const decryptedMessage = Crypt.Decryption(encryptedMessage);
                if (decryptedMessage.error === '') {
                    console.log('Sending message to room:', decryptedMessage.data);
                    socket.to(decryptedMessage.data.roomKey).emit('message', decryptedMessage.data);
                } else {
                    console.log('Failed to decrypt message');
                }
            });

            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
            });
        });
    };
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
