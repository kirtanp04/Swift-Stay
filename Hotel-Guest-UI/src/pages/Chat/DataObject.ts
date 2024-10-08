import { Api, getGETParamData } from "src/common/ApiCall";
import { Param } from "src/Constant";
import { enumUserRole } from "../Authentication/AuthMgr";

class Sender {
    _id: string = "";

    email: string = "";

    name: string = "";

    profileImg: string = "";

    role: enumUserRole = enumUserRole.guest;
}

export class Chat {
    _id: string = "";

    message: string = "";

    date: Date = new Date();

    key: string = "";

    senderDetail: Sender = new Sender();

    static InitRedis = async (
        userID: string,
        role: string,
        onsuccess: (res: any) => void,
        onfail: (err: any) => void
    ) => {
        try {
            const _Param = getGETParamData(
                Param.broker.chat,
                Param.function.chat.initRedisForChat,
                { id: userID, role: role }
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


    static GetChatData = async (
        userID: string,
        role: string,
        ChatKey: string,
        onsuccess: (res: any) => void,
        onfail: (err: any) => void
    ) => {
        try {
            const _Param = getGETParamData(
                Param.broker.chat,
                Param.function.chat.getChatData,
                { id: userID, role: role, chatKey: ChatKey }
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
}
