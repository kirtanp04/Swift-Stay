import { NextFunction, Request, Response } from 'express';
import { Cache, GetUserErrorObj, GetUserSuccessObj, HttpStatusCodes, ProjectResponse, UserResponse } from '../common';
import { CacheKey, Param } from '../Constant';
import { checkGuestVerification } from '../middleware/GuestVerification';
import { ChatObj, TParam } from '../types/Type';
import { enumUserRole } from '../models/UserModel';
import { checkAdminVerification } from '../middleware/AdiminVerification';
import { Chat } from '../models/ChatModel';

// guest
const _GuestSaveChat = Param.function.guest.chat.saveChat;

// Admin
const _ManagerSaveChat = Param.function.manager.chat.saveChat;

export class ChatFunction {
    private static objUserResponse: UserResponse = new UserResponse();

    static findFunction = async (objParam: TParam, req: Request, res: Response, next: NextFunction): Promise<UserResponse> => {
        let _Function = new Functions();
        _Function.req = req;
        _Function.res = res;
        _Function.next = next;
        _Function.objParam = objParam;

        switch (objParam.function) {
            case _GuestSaveChat:
                this.objUserResponse = await _Function.SaveChatData();
                break;

            case _ManagerSaveChat:
                this.objUserResponse = await _Function.SaveChatData();
                break;

            default:
                this.objUserResponse = GetUserErrorObj('Server error: Wronge Function.', HttpStatusCodes.BAD_REQUEST);
                break;
        }

        return this.objUserResponse;
    };
}

class Functions {
    private objUserResponse: UserResponse = new UserResponse();

    public req: Request | null = null;

    public res: Response | null = null;

    public next: NextFunction | null = null;

    public objParam: TParam = new TParam();

    public SaveChatData = async (): Promise<UserResponse> => {
        try {
            const chatData: ChatObj = this.objParam.data;

            let verifiyRes = new ProjectResponse();
            if (chatData.senderDetail.role === enumUserRole.guest) {
                verifiyRes = await checkGuestVerification(chatData.senderDetail._id);
            }

            if (chatData.senderDetail.role === enumUserRole.admin) {
                verifiyRes = await checkAdminVerification(chatData.senderDetail._id);
            }

            if (verifiyRes.error === '') {
                //storing in db

                const isSaveChat = await Chat.findOneAndUpdate(
                    { key: chatData.key },
                    {
                        $push: {
                            chatInfo: chatData,
                        },
                    },
                    { upsert: true, new: true }
                );

                if (isSaveChat) {
                    const cacheData = Cache.getCacheData(CacheKey.chat(chatData.key));

                    if (cacheData.error === '') {
                        Cache.ClearCache(CacheKey.chat(chatData.key));
                    }

                    this.objUserResponse = GetUserSuccessObj(`Success to store Chat in DB`, HttpStatusCodes.OK);
                } else {
                    this.objUserResponse = GetUserErrorObj('Not able stored chat in DB', HttpStatusCodes.BAD_REQUEST);
                }

                //clear cache base on chat key
            } else {
                this.objUserResponse = GetUserErrorObj(verifiyRes.error, HttpStatusCodes.NOT_ACCEPTABLE);
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse;
        }
    };
}