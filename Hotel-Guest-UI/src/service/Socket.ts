import { io, Socket } from "socket.io-client";
import { Crypt } from "src/common/Crypt";
import { enumUserRole } from "src/pages/Authentication/AuthMgr";
import { Chat as ChatObj } from "src/pages/Chat/DataObject";
import { SocketKeyName } from "../Constant";

export class SocketUserAuth {
    name: string = "";
    email: string = "";
    role: enumUserRole = enumUserRole.guest;
    _id: string = "";
}

export class SocketService {

    private _Socket: Socket | null = null;

    constructor(
        sockerUrl: string,
        objUser: SocketUserAuth,
        onMessage: (msg: ChatObj) => void,
        onUserTyping: (data: ChatObj) => void,
        onError: (err: any) => void,
        connectionloading: (value: boolean) => void
    ) {
        this._Socket = this.ConnectToSocket(sockerUrl, objUser, connectionloading, onError);
        if (this._Socket) {
            this.setupEventListeners();
            this.setupMessageReception(onMessage, onUserTyping, onError);
        } else {
            onError("Failed to connect to socket server.");
        }
    }

    private ConnectToSocket = (
        sockerUrl: string,
        objUser: SocketUserAuth,
        connectionloading: (value: boolean) => void,
        onError: (err: any) => void,
    ): Socket | null => {
        try {
            const encryptedObj = Crypt.Encryption(objUser);
            if (encryptedObj.error === "") {
                try {
                    const socket = io(sockerUrl, {
                        auth: {
                            userInfo: encryptedObj.data,
                        },
                        reconnectionAttempts: 5,
                        reconnectionDelay: 1000,
                    });
                    this.setupConnectionHandlers(socket, connectionloading, onError);
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

    private setupConnectionHandlers(socket: Socket, connectionloading: (value: boolean) => void, onError: (err: any) => void) {
        connectionloading(true);

        socket.on("connect", () => {
            console.log("Connected to socket server.");
            connectionloading(false);
        });

        socket.on("disconnect", (reason: Socket.DisconnectReason) => {
            console.warn("Disconnected from socket server:", reason);
            if (reason === "io server disconnect") {
                socket.connect();
            }
            connectionloading(false);
        });

        socket.on("reconnect_attempt", (attempt) => {
            console.log(`Reconnection attempt ${attempt}`);
            connectionloading(false);
        });

        socket.on("reconnect_failed", () => {
            onError("Reconnection failed");
            this.disconnect();
        });

        socket.on("connect_error", (err: Error) => {
            onError("Connection error: " + err.message);
            this.disconnect();
        });
    }

    private setupEventListeners = () => {
        this._Socket?.on("roomJoined", (data: any) => {
            console.log("roomJoined event received:", data);
            const decryptChat = Crypt.Decryption(data);
            if (decryptChat.error === "") {
                console.log("Decrypted chat message:", decryptChat.data);
            } else {
                console.error("Failed to decrypt chat message:", decryptChat.error);
            }
        });
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

    public joinRoom = (roomKey: ChatObj, onfail?: (err: any) => void) => {
        if (!this._Socket) {
            onfail?.("Socket is not connected.");
            return;
        }

        try {
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

    public reconnect = () => {
        if (this._Socket && this._Socket.disconnected) {
            console.log("Attempting to reconnect...");
            this._Socket.connect();
        } else {
            console.log("Socket is already connected or not initialized.");
        }
    };

    public disconnect() {
        if (this._Socket) {
            this._Socket.off("roomJoined");
            this._Socket.off("connect");
            this._Socket.off("disconnect");
            this._Socket.off("reconnect_attempt");
            this._Socket.off("reconnect_failed");
            this._Socket.off("connect_error");
            this._Socket.disconnect();
            this._Socket = null;
        }
    }
}
