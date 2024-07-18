// SocketService.ts
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
    private RoomKey: string = "";

    constructor(objUser: SocketUserAuth, onMessage: (msg: ChatObj) => void, onUserTyping: (err: ChatObj) => void, onError: (err: any) => void) {
        this._Socket = this.ConnectToSocket(objUser);
        this.setupEventListeners();
        this.setupMessageReception(onMessage, onUserTyping, onError);
    }

    private ConnectToSocket = (objUser: SocketUserAuth) => {
        try {
            const encryptedObj = Crypt.Encryption(objUser);
            let _Socket: any;
            if (encryptedObj.error === "") {
                try {
                    _Socket = io(this.BackendURL, {
                        auth: {
                            userInfo: encryptedObj.data,
                        },
                    });
                    return _Socket;
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    private setupEventListeners = () => {
        this._Socket?.on('roomJoined', (data: any) => {
            console.log('roomJoined event received:', data);
            const decryptChat = Crypt.Decryption(data);
            if (decryptChat.error === "") {
                console.log('Decrypted chat message:', decryptChat.data);
            } else {
                console.error('Failed to decrypt chat message');
            }
        });
    };

    public joinRoom = (roomKey: ChatObj, onfail?: (err: any) => void) => {
        try {
            if (this.RoomKey === "") {
                this.RoomKey = roomKey.key;
                this._Socket?.emit(SocketKeyName.JoinRoom, Crypt.Encryption(roomKey).data);
            } else {
                this._Socket?.emit(SocketKeyName.JoinRoom, Crypt.Encryption(roomKey).data);
            }
        } catch (error: any) {
            if (onfail !== undefined) {
                onfail(error.message);
            }
        }
    };

    public sendChatMessageInRoom = (
        socketKeyName: string,
        objChat: ChatObj,
        onfail?: (err: any) => void
    ) => {
        try {
            const encryptedChat = Crypt.Encryption(objChat);
            if (encryptedChat.error === "") {
                this._Socket?.emit(socketKeyName, encryptedChat.data);
            } else {
                if (onfail !== undefined) {
                    onfail("Not able to Encrypt Your Chat");
                }
            }
        } catch (error: any) {
            if (onfail !== undefined) {
                onfail(error.message);
            }
        }
    };

    private GetChatMessage = (
        socketKeyName: string,
        onSuccess: (objChat: ChatObj) => void,
        onfail?: (err: any) => void
    ) => {
        try {
            this._Socket?.on(socketKeyName, (data: any) => {
                const decryptChat = Crypt.Decryption(data);
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

    private setupMessageReception = (onMessage: (msg: ChatObj) => void, onUserTyping: (err: ChatObj) => void, onError: (err: ChatObj) => void) => {
        this.GetChatMessage(SocketKeyName.ReceiveMessage, (data) => {
            onMessage(data);
        }, (error) => {
            onError(error);
        });

        this.GetChatMessage(SocketKeyName.UserIsTyping, (data) => {
            onUserTyping(data)
        }, (error) => {
            onError(error)
        })

        this.GetChatMessage(SocketKeyName.ReceiveError, (data) => {
            onError(data);
        }, (error) => {
            onError(error);
        });
    };
}
