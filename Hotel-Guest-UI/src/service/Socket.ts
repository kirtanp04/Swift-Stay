import { io, Socket } from "socket.io-client";
import { Crypt } from "src/common/Crypt";
import { enumUserRole } from "src/pages/Authentication/AuthMgr";
import { ChatObj } from "src/pages/Chat/DataObject";
import { SocketIoBaseUrl, SocketKeyName } from "../Constant";

export class SocketUserAuth {
    name: string = "";
    email: string = "";
    role: enumUserRole = enumUserRole.guest;
    _id: string = "";
}

export class SocketService {
    private BackendURL: string = SocketIoBaseUrl;
    private _Socket: Socket | null = null;

    constructor(
        objUser: SocketUserAuth,
        onMessage: (msg: ChatObj) => void,
        onUserTyping: (data: ChatObj) => void,
        onError: (err: any) => void
    ) {
        this._Socket = this.ConnectToSocket(objUser, onError);
        if (this._Socket) {
            this.setupEventListeners();
            this.setupMessageReception(onMessage, onUserTyping, onError);
        } else {
            onError("Failed to connect to socket server.");
        }
    }

    private ConnectToSocket = (objUser: SocketUserAuth, onError: (err: any) => void): Socket | null => {
        try {
            const encryptedObj = Crypt.Encryption(objUser);
            if (encryptedObj.error === "") {
                try {
                    const socket = io(this.BackendURL, {
                        auth: {
                            userInfo: encryptedObj.data,
                        },
                        reconnectionAttempts: 5, // Limit reconnection attempts
                        reconnectionDelay: 1000, // Delay between reconnection attempts
                    });
                    this.setupConnectionHandlers(socket);
                    return socket;
                } catch (error) {
                    onError(error);
                }
            } else {
                onError(encryptedObj.error);
            }
        } catch (error) {
            onError(error);
        }
        return null;
    };

    private setupConnectionHandlers(socket: Socket) {
        socket.on("connect", () => {
            console.log("Connected to socket server.");
        });

        socket.on("disconnect", (reason) => {
            console.warn("Disconnected from socket server:", reason);
        });

        socket.on("reconnect_attempt", (attempt) => {
            console.log(`Reconnection attempt ${attempt}`);
        });

        socket.on("reconnect_failed", () => {
            console.error("Reconnection failed.");
        });
    }

    private setupEventListeners = () => {
        this._Socket?.on('roomJoined', (data: any) => {
            console.log('roomJoined event received:', data);
            const decryptChat = Crypt.Decryption(data);
            if (decryptChat.error === "") {
                console.log('Decrypted chat message:', decryptChat.data);
            } else {
                console.error('Failed to decrypt chat message:', decryptChat.error);
            }
        });
    };

    public joinRoom = (roomKey: ChatObj, onfail?: (err: any) => void) => {
        if (!this._Socket) {
            onfail?.("Socket is not connected.");
            return;
        }

        try {
            // this.RoomKey = roomKey.key;
            const encryptedRoomKey = Crypt.Encryption(roomKey).data;
            this._Socket.emit(SocketKeyName.JoinRoom, encryptedRoomKey);
        } catch (error: any) {
            onfail?.(error.message);
        }
    };

    public sendChatMessageInRoom = (
        socketKeyName: string,
        objChat: ChatObj,
        onfail?: (err: any) => void
    ) => {
        if (!this._Socket) {
            onfail?.("Socket is not connected.");
            return;
        }

        try {
            const encryptedChat = Crypt.Encryption(objChat);
            if (encryptedChat.error === "") {
                this._Socket.emit(socketKeyName, encryptedChat.data);
            } else {
                onfail?.("Failed to encrypt chat message.");
            }
        } catch (error: any) {
            onfail?.(error.message);
        }
    };

    private GetChatMessage = (
        socketKeyName: string,
        onSuccess: (objChat: ChatObj) => void,
        onfail?: (err: any) => void
    ) => {
        if (!this._Socket) {
            onfail?.("Socket is not connected.");
            return;
        }

        try {
            this._Socket.on(socketKeyName, (data: any) => {
                const decryptChat = Crypt.Decryption(data);
                if (decryptChat.error === "") {
                    onSuccess(decryptChat.data);
                } else {
                    onfail?.("Failed to decrypt chat message.");
                }
            });
        } catch (error: any) {
            onfail?.(error.message);
        }
    };

    private setupMessageReception = (
        onMessage: (msg: ChatObj) => void,
        onUserTyping: (data: ChatObj) => void,
        onError: (err: any) => void
    ) => {
        this.GetChatMessage(SocketKeyName.ReceiveMessage, onMessage, onError);
        this.GetChatMessage(SocketKeyName.UserIsTyping, onUserTyping, onError);
        this.GetChatMessage(SocketKeyName.ReceiveError, onError, onError);
    };

    // Optional: Method to disconnect and clean up event listeners
    public disconnect() {
        if (this._Socket) {
            this._Socket.disconnect();
            this._Socket = null;
            console.log("Socket disconnected.");
        }
    }
}
