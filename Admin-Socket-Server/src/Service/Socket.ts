import { Server, Socket } from "socket.io";
import { runChat } from "../Index";
import { Crypt } from "../common";
import { ChatObj, CustomSocket, SocketKeyName, SocketUserAuth } from "./DataObject";




const OnJoinChatMess = new ChatObj();
OnJoinChatMess.message = "User is live now";

export class WebSocket {
    private io: Server;
    private ActiveRoom: string = "";
    private Socket: CustomSocket | null = null;
    constructor(SocketServer: Server) {
        this.io = SocketServer;
        this.UserAuthMiddleWare();
        this.HandleConnections();
        this.OnJoinRoom(OnJoinChatMess)
        this.SendUserTypingMessage()
    }

    public userInfo: SocketUserAuth = new SocketUserAuth();

    private UserAuthMiddleWare = () => {
        try {
            this.io.use((socket: CustomSocket, next) => {
                const encryptedUserInfo = socket.handshake.auth.userInfo;
                const decryptedUserInfo = Crypt.Decryption(encryptedUserInfo);

                if (
                    decryptedUserInfo.error === "" &&
                    decryptedUserInfo.data.role === "admin"
                ) {
                    socket.userDetail = decryptedUserInfo.data;
                    this.userInfo = decryptedUserInfo.data;
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
            runChat();
        });
    };

    private SendUserTypingMessage = () => {
        try {
            this.Socket?.on(SocketKeyName.TypingMessage, (encryptString: string) => {
                const objDecryptKey: ChatObj = Crypt.Decryption(encryptString).data;
                this.Socket!.broadcast.to(objDecryptKey.key).emit(
                    SocketKeyName.onJoinRoom,
                    "User is typing"
                );
            });
        } catch (error) { }
    };

    private OnJoinRoom = (ResPonseDate: ChatObj) => {
        this.Socket!.on(SocketKeyName.JoinRoom, (roomKey: string) => {
            const objDecryptKey: ChatObj = Crypt.Decryption(roomKey).data;
            this.Socket!.join(objDecryptKey.key);

            if (this.ActiveRoom === objDecryptKey.key) {
                const encryptMess = Crypt.Encryption(ResPonseDate).data;
                this.Socket!.to(objDecryptKey.key).emit(
                    SocketKeyName.onJoinRoom,
                    encryptMess
                );
            }

            this.ActiveRoom = objDecryptKey.key;
        });
    };

    public SendChatMessageInRoom = (SocketName: string, data: ChatObj) => {
        try {
            const encryptedChat = Crypt.Encryption(data).data;
            this.Socket!.to(data.key).compress(true).emit(SocketName, encryptedChat);
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

