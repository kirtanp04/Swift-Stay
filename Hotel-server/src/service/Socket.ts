import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { Crypt } from '../common'
import { enumUserRole } from '../models/UserModel'
import { SecrtKey } from '../env'

export class SocketUserAuth {
    name: string = ''

    email: string = ''

    role: enumUserRole = enumUserRole.guest

    _id: string = ''

}

export interface CustomSocket extends Socket {
    UserInfo?: SocketUserAuth;
}

export class WebSocket {

    private HtttpServer = createServer()
    private IO: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null = null

    constructor() {
        const IO = this.CreateSocketServer()

        this.IO = IO

        this.MiddleWare();

        this.HandleConnections();
    }


    public CreateSocketServer = (): Server => {
        const IO = new Server(this.HtttpServer, {
            cors: {
                origin: (origin, callback) => {
                    const allowedOrigins = [SecrtKey.FRONTEND_URL];
                    if (allowedOrigins.includes(origin!)) {
                        callback(null, true);
                    } else {
                        callback(new Error("Not allowed by CORS"));
                    }
                },
                methods: ["GET", "POST"],
                credentials: true
            },
        })
        return IO
    }

    public MiddleWare = (): void => {
        try {
            this.IO?.use((socket: CustomSocket, next) => {
                const token: string = socket.handshake.auth.UserInfo
                const decryptedObj = Crypt.Decryption(token)
                if (decryptedObj.error === '') {
                    socket.UserInfo = decryptedObj.data;
                    next()
                } else {
                    next(new Error('You are not Authenticated For Using Chat Service. Login to perform this task.'));
                }
            })
        } catch (error: any) {
            console.log({ soccket_Middleware_error: error.message })
        }

    }

    public HandleConnections = (): void => {

        try {
            this.IO?.on('connection', (socket: CustomSocket) => {
                console.log(`User Connected -> UserName: ${socket.UserInfo?.name} / Email:${socket.UserInfo?.email} / Role:${socket.UserInfo?.role}`)


                socket.on('message', (msg: any) => {
                    console.log(`Message from ${socket.UserInfo?.name}: ${msg}`);
                    this.IO?.emit('message', msg);
                });


                socket.on('disconnect', () => {
                    console.log(`User disconnected: ${socket.UserInfo?.name}`);
                });

            })

        } catch (error: any) {
            console.log({ soccket_Handel_error: error.message })
        }

    }

    public Start = (port: number): void => {
        this.HtttpServer.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    }

}





// const socket = io('http://localhost:3000', {
//   auth: {
//     UserInfo: 'your_jwt_token' //send encrypted user info name role id email
//   }
// });  frontend code.