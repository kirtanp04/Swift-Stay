import { Api, getGETParamData } from "src/common/ApiCall"
import { Param } from "src/Constant"
import { StoreError } from "src/util/StoreError"

export class ChatObj {
    message: string = ''

    date: Date | string = new Date()

    key: string = ''

    senderDetail: Sender = new Sender()
}

class Sender {
    _id: string = ''

    email: string = ''

    name: string = ''

    profileImg: string = ''
}





export class TSubscriber extends Sender { }




export class ChatApi {

    static InitChatService = async (
        adminID: string,
        onsuccess: (res: any) => void,
        onFail: (err: any) => void
    ) => {
        try {
            const _Param = getGETParamData(Param.broker.manager.chat, Param.function.manager.chat.Init, {
                adminID: adminID
            })

            await Api.protectedGet(_Param, (res) => {
                if (res.error !== '') {
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




