import { Api, getGETParamData } from "src/common/ApiCall"
import { Param } from "src/Constant"
import { StoreError } from "src/util/StoreError"
import { _Register, enumUserRole } from "../Authentication/AuthMgr"

export class ChatObj {
    message: string = ''

    date: Date = new Date()

    key: string = ''

    senderDetail: Sender = new Sender()
}

class Sender {
    _id: string = ''

    email: string = ''

    name: string = ''

    profileImg: string = ''

    role: enumUserRole = enumUserRole.admin
}





export class SubscriberClass {
    _id: string = '';
    property: string = '';
    adminID: string = ""
    subscribers: _Register[] = []

}




export class TSubscriber extends Sender {
    chatKey: string = ''
}




export class ChatApi {

    static initRedisService = async (AdminID: string, role: string, onSuccess: (res: any) => void, onError: (err: any) => void) => {
        const _Param = getGETParamData(Param.broker.manager.Redis, Param.function.manager.redis.initRedis, { id: AdminID, role: role })

        try {
            await Api.get(_Param, (res) => {

                if (res.error === '') {
                    onSuccess(res.data)
                } else {
                    onError(res.error)
                }

            })
        } catch (error: any) {
            onError(error)
        }
    }

    static getAllSubscribedUsers = async (
        adminID: string,
        onsuccess: (res: any) => void,
        onFail: (err: any) => void
    ) => {
        try {
            const _Param = getGETParamData(Param.broker.manager.chat, Param.function.manager.subscriber.GetAllSubscriber,
                adminID)

            await Api.protectedGet(_Param, (res) => {
                if (res.error === '') {
                    onsuccess(res.data)
                } else {
                    onFail(res.error)
                }
            })

        } catch (error: any) {
            StoreError("Chat Initialization", error.message);
            onFail(error.message);
        }
    }
}




