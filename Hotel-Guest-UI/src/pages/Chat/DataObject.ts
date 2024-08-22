import { Api, getGETParamData } from "src/common/ApiCall"
import { Param } from "src/Constant"

class Sender {
    _id: string = ''

    email: string = ''

    name: string = ''

    profileImg: string = ''
}

export class Chat {
    message: string = ''

    date: Date = new Date()

    key: string = ''

    senderDetail: Sender = new Sender()

    static initRedisService = async (guestID: string, onSuccess: (res: any) => void, onError: (err: any) => void) => {
        const _Param = getGETParamData(Param.broker.Redis, Param.function.redis.initRedis, guestID)

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

