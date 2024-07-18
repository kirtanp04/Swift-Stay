import { Socket } from "socket.io";

export const SocketKeyName = {
    JoinRoom: "Join_room",
    SendMessage: "Send_Message",
    ReceiveMessage: "Receive_Message",
    ReceiveError: "Receive_Error",
    onJoinRoom: "roomJoined",
    TypingMessage: "TypingMessage",
    UserIsTyping: "UserIsTyping",
};

export class SocketUserAuth {
    name: string = "";
    email: string = "";
    _id: string = "";
    role: string = "";
}

export interface CustomSocket extends Socket {
    userDetail?: SocketUserAuth;
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
