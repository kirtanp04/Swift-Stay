import { io, Socket } from 'socket.io-client';
import { Crypt } from 'src/common/Crypt';
import { BackendBaseApi } from "src/Constant";
import { enumUserRole } from 'src/pages/Authentication/AuthMgr';
import { ChatObj } from 'src/pages/Chat/DataObject';

export class SocketUserAuth {
    name: string = ''

    email: string = ''

    role: enumUserRole = enumUserRole.guest

    _id: string = ''

}


export class SocketService {

    private BackendURL: string = BackendBaseApi
    private _Socket: Socket | null = null
    private RoomKey: string = ''
    private JoinroomsocketName: string = 'Join_Room'

    constructor(objUser: SocketUserAuth) {
        this._Socket = this.ConnectToSocket(objUser)
    }

    private ConnectToSocket = (objUser: SocketUserAuth): Socket => {
        const encryptedObj = Crypt.Encryption(objUser)
        let _Socket: any
        if (encryptedObj.error === '') {

            _Socket = io(this.BackendURL, {
                auth: {
                    userInfo: encryptedObj.data
                }
            })
        }
        return _Socket
    }

    public joinRoom = (roomKey: string, onfail?: (err: any) => void) => {
        try {
            if (this.RoomKey === '') {
                this.RoomKey = roomKey
                this._Socket?.emit(this.JoinroomsocketName, roomKey)
            } else {
                this._Socket?.emit(this.JoinroomsocketName, roomKey)
            }
        } catch (error: any) {
            if (onfail !== undefined) {
                if (onfail !== undefined) {
                    onfail(error.message)

                }
            }

        }

    }

    public SendChatMessageInRoom = (socketKeyName: string, objChat: ChatObj, onfail?: (err: any) => void) => {

        try {

            if (this.RoomKey === '') {
                if (onfail !== undefined) {

                    onfail('First You Need to Join Room')
                }
            } else {
                const encryptedChat = Crypt.Encryption(objChat)

                if (encryptedChat.error === '') {
                    this._Socket?.emit(socketKeyName, encryptedChat.data)
                } else {
                    if (onfail !== undefined) {

                        onfail('Not able to Encrypt Your Chat')
                    }
                }

            }


        } catch (error: any) {
            if (onfail !== undefined) {
                onfail(error.message)

            }
        }

    }


}