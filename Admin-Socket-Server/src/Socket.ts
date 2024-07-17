import { Server, Socket } from "socket.io";
import { runChat } from ".";
import { Crypt } from "./common/index";


export const SocketKeyName = {
    JoinRoom: 'Join_room',
    SendMessage: 'Send_Message',
    ReceiveMessage: 'Receive_Message',
    ReceiveError: 'Receive_Error',
    onJoinRoom: 'roomJoined'
}

export class SocketUserAuth {
    name: string = "";
    email: string = "";
    _id: string = "";
    role: string = ''
}

export interface CustomSocket extends Socket {
    userDetail?: SocketUserAuth;
}

export class WebSocket {
    private io: Server;
    private ActiveRoom: string = "";
    private Socket: CustomSocket | null = null;
    constructor(SocketServer: Server) {
        this.io = SocketServer;
        this.UserAuthMiddleWare();
        this.HandleConnections();
    }

    public userInfo: SocketUserAuth = new SocketUserAuth()

    private UserAuthMiddleWare = () => {
        try {
            this.io.use((socket: CustomSocket, next) => {
                const encryptedUserInfo = socket.handshake.auth.userInfo;
                const decryptedUserInfo = Crypt.Decryption(encryptedUserInfo);

                if (decryptedUserInfo.error === "" && decryptedUserInfo.data.role === 'admin') {
                    socket.userDetail = decryptedUserInfo.data;
                    this.userInfo = decryptedUserInfo.data
                    next();
                } else {
                    next(new Error("Authentication error"));
                }
            });
        } catch (error) { }
    };

    private HandleConnections = () => {
        this.io.on("connection", (socket: CustomSocket) => {
            console.log("User connected:", socket.id);
            this.Socket = socket;
            runChat()
        });
    };

    public OnJoinRoom = (ResPonseDate: ChatObj) => {

        this.Socket!.on(SocketKeyName.JoinRoom, (roomKey: string) => {
            const objDecryptKey: ChatObj = Crypt.Decryption(roomKey).data;
            // console.log("Joining room:", roomKey);
            this.Socket!.join(objDecryptKey.key);

            if (this.ActiveRoom === objDecryptKey.key) {
                const encryptMess = Crypt.Encryption(ResPonseDate).data;
                // console.log("Emitting roomJoined event to room:", roomKey);
                this.Socket!.to(objDecryptKey.key).emit(SocketKeyName.onJoinRoom, encryptMess);
            }

            this.ActiveRoom = objDecryptKey.key;
        });

    };

    public SendChatMessageInRoom = (
        SocketName: string,
        data: ChatObj
    ) => {
        try {
            const encryptedChat = Crypt.Encryption(data).data;
            this.Socket!.to(data.key).emit(SocketName, encryptedChat);
        } catch (error) { }
    };

    public getChatMessage = (
        SocketName: string,
        onSuccess: (res: ChatObj) => void,
        onfail: (err: any) => void
    ) => {
        try {
            this.Socket!.on(SocketName, (data: any) => {
                const decryptChat = Crypt.Decryption(data);
                // console.log(decryptChat.data)
                if (decryptChat.error === "") {
                    onSuccess(decryptChat.data);
                } else {
                    if (onfail !== undefined) {
                        onfail("Not able to decrypt Your Chat");
                    }
                }
            });
        } catch (error: any) {
            if (onfail !== undefined) {
                onfail(error.message);
            }
        }
    };

    public OnDisconnect = () => {

        try {
            this.Socket!.on("disconnect", () => {
                console.log("User disconnected:", this.Socket!.userDetail?.name);
            });
        } catch (error) { }

    };
}

export class ChatObj {
    message: string = "";
    date: Date | string = new Date();
    key: string = "";
    senderDetail: Sender = new Sender();
}

class Sender {
    id: string = "";
    email: string = "";
    name: string = "";
    profileImg: string = "";
}
