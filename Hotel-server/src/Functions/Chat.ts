import { NextFunction, Request, Response } from 'express';
import { Cache, GetUserErrorObj, GetUserSuccessObj, HttpStatusCodes, ProjectResponse, UserResponse } from '../common';
import { CacheKey, Param, QueueName } from '../Constant';
import { checkAdminVerification } from '../middleware/AdiminVerification';
import { checkGuestVerification } from '../middleware/GuestVerification';
import { Chat, TChat } from '../models/ChatModel';
import { enumUserRole } from '../models/UserModel';
import { Redis } from '../service/Redis';
import { ChatObj, TParam } from '../types/Type';
import { QueueManager } from '../service/Queue';

// // guest
// const _GuestSaveChat = Param.function.guest.chat.saveChat;

// // Admin
// const _ManagerSaveChat = Param.function.manager.chat.saveChat;

// common

const _InitAdminRedis = Param.function.guest.chat.initRedisForChat;
const _InitGuestRedis = Param.function.guest.chat.initRedisForChat;
const _GetChatData = Param.function.guest.chat.getChatData;

const _Redis = new Redis();

export class ChatFunction {
    private static objUserResponse: UserResponse = new UserResponse();

    static findFunction = async (objParam: TParam, req: Request, res: Response, next: NextFunction): Promise<UserResponse> => {
        let _Function = new Functions();
        _Function.req = req;
        _Function.res = res;
        _Function.next = next;
        _Function.objParam = objParam;

        switch (objParam.function) {
            // case _GuestSaveChat:
            //     this.objUserResponse = await _Function.SaveChatData();
            //     break;

            // case _ManagerSaveChat:
            //     this.objUserResponse = await _Function.SaveChatData();
            //     break;

            case _InitGuestRedis:
                this.objUserResponse = await _Function.InitRedisForChat();
                break;

            case _InitAdminRedis:
                this.objUserResponse = await _Function.InitRedisForChat();
                break;

            case _GetChatData:
                this.objUserResponse = await _Function.GetChatData();
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

    private ChatQueue: QueueManager = new QueueManager();

    public req: Request | null = null;

    public res: Response | null = null;

    public next: NextFunction | null = null;

    public objParam: TParam = new TParam();

    private SaveChatData = async (): Promise<UserResponse> => {
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
                            chatInfo: {
                                message: chatData.message,
                                date: chatData.date,
                                senderDetail: chatData.senderDetail,
                                key: chatData.key
                            },
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

    public InitRedisForChat = async (): Promise<UserResponse> => {
        try {
            const { id, role } = this.objParam.data;

            let res = new ProjectResponse();

            if (role === enumUserRole.admin) {
                res = await checkAdminVerification(id);
            }

            if (role === enumUserRole.guest) {
                res = await checkGuestVerification(id);
            }

            if (res.error === '') {
                const Redisres = await _Redis.connect();
                this.ChatQueue.createQueue(QueueName.ChatQueue, 1);

                _Redis.subscribeAdminChat(
                    (mess) => {
                        this.objParam.data = mess;
                        this.ChatQueue.addTask(QueueName.ChatQueue, async () => await this.SaveChatData());
                    },
                    (err) => {
                        console.log(err);
                    }
                );

                _Redis.subscribeUserChat(
                    (mess) => {
                        console.log(mess)
                        this.objParam.data = mess;
                        this.ChatQueue.addTask(QueueName.ChatQueue, async () => await this.SaveChatData());
                    },
                    (err) => {
                        console.log(err);
                    }
                );

                if (Redisres.error === '') {
                    this.objUserResponse = GetUserSuccessObj(Redisres.data, HttpStatusCodes.OK);
                } else {
                    this.objUserResponse = GetUserErrorObj(Redisres.error, HttpStatusCodes.NOT_ACCEPTABLE);
                }
            } else {
                this.objUserResponse = GetUserErrorObj(
                    res.error !== '' ? res.error : 'Server error: you are not a valid user.',
                    HttpStatusCodes.NOT_ACCEPTABLE
                );
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse;
        }
    };

    public GetChatData = async (): Promise<UserResponse> => {
        try {
            const { id, role, chatKey } = this.objParam.data;

            let verifiyRes = new ProjectResponse();
            if (role === enumUserRole.guest) {
                verifiyRes = await checkGuestVerification(id);
            }

            if (role === enumUserRole.admin) {
                verifiyRes = await checkAdminVerification(id);
            }

            if (verifiyRes.error === '') {
                const cacheData = Cache.getCacheData(CacheKey.chat(chatKey));

                if (cacheData.error === '') {
                    this.objUserResponse = GetUserSuccessObj(cacheData.data, HttpStatusCodes.OK);
                } else {
                    const ChatData = await Chat.findOne({ key: chatKey });

                    if (ChatData !== null) {
                        Cache.SetCache(CacheKey.chat(chatKey), ChatData);
                        this.objUserResponse = GetUserSuccessObj(ChatData, HttpStatusCodes.OK);
                    } else {
                        this.objUserResponse = GetUserSuccessObj(new TChat(), HttpStatusCodes.OK);
                    }
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
