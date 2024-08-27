import { Api, getGETParamData } from "src/common/ApiCall"
import { Param } from "src/Constant"
import { enumUserRole } from "../Authentication/AuthMgr"

class Sender {
    _id: string = ''

    email: string = ''

    name: string = ''

    profileImg: string = ''

    role: enumUserRole = enumUserRole.guest
}

export class Chat {
    message: string = ''

    date: Date = new Date()

    key: string = ''

    senderDetail: Sender = new Sender()

    static initRedisService = async (guestID: string, role: string, onSuccess: (res: any) => void, onError: (err: any) => void) => {
        const _Param = getGETParamData(Param.broker.Redis, Param.function.redis.initRedis, { id: guestID, role: role })

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
}

