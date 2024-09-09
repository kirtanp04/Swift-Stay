import { Api, getGETParamData } from "src/common/ApiCall"
import { Param } from "src/Constant"
import { StoreError } from "src/util/StoreError"
import { _Register, enumUserRole } from "../Authentication/AuthMgr"

export class ChatObj {

    _id: string = ''
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

    static InitRedis = async (
        AdminID: string,
        role: string,
        onsuccess: (res: any) => void,
        onfail: (err: any) => void
    ) => {
        try {
            const _Param = getGETParamData(
                Param.broker.manager.chat,
                Param.function.manager.chat.initRedisForChat,
                { id: AdminID, role: role }
            );
            await Api.protectedGet(
                _Param,
                (res) => {
                    if (res.error === "") {
                        onsuccess(res.data);
                    } else {
                        onfail(res.error);
                    }
                },
                (progressValue) => {
                    console.log(progressValue);
                }
            );
        } catch (error: any) {
            onfail(error.message);
        }
    };

    static getAllSubscribedUsers = async (
        adminID: string,
        onsuccess: (res: any) => void,
        onFail: (err: any) => void
    ) => {
        try {
            const _Param = getGETParamData(Param.broker.manager.subscriber, Param.function.manager.subscriber.GetAllSubscriber,
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




