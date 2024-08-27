import { NextFunction, Request, Response } from 'express';
import { GetUserErrorObj, GetUserSuccessObj, HttpStatusCodes, ProjectResponse, UserResponse } from '../common';
import { Param } from '../Constant';
import { TParam } from '../types/Type';
import { checkGuestVerification } from '../middleware/GuestVerification';
import { Redis } from '../service/Redis';
import { enumUserRole } from '../models/UserModel';
import { ChatFunction } from './Chat';
import { checkAdminVerification } from '../middleware/AdiminVerification';

// guest
const _GuestInitRedis = Param.function.guest.redis.initRedis;

// Admin
const _ManagerInitRedis = Param.function.manager.redis.initRedis;

export class RedisFunction {
    private static objUserResponse: UserResponse = new UserResponse();

    static findFunction = async (objParam: TParam, req: Request, res: Response, next: NextFunction): Promise<UserResponse> => {
        let _Function = new Functions();
        _Function.req = req;
        _Function.res = res;
        _Function.next = next;
        _Function.objParam = objParam;

        switch (objParam.function) {
            case _GuestInitRedis:
                this.objUserResponse = await _Function.InitRedisService();
                break;

            case _ManagerInitRedis:
                this.objUserResponse = await _Function.InitRedisService();
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

    public InitRedisService = async (): Promise<UserResponse> => {
        try {
            const { id, role } = this.objParam.data;

            let isVerified = new ProjectResponse()

            if (role === enumUserRole.admin) {
                isVerified = await checkAdminVerification(id);
            }

            if (role === enumUserRole.guest) {
                isVerified = await checkGuestVerification(id);
            }



            if (isVerified.error === '') {
                try {
                    const _Redis = new Redis();
                    _Redis.connect();

                    _Redis.subscribeUserChat(
                        async (mess) => {
                            console.log(mess)

                            const objParam = new TParam()

                            if (mess.senderDetail.role === enumUserRole.admin) {
                                objParam.Broker = Param.broker.manager.chat
                                objParam.function = Param.function.manager.chat.saveChat
                            }

                            if (mess.senderDetail.role === enumUserRole.guest) {
                                objParam.Broker = Param.broker.guest.chat
                                objParam.function = Param.function.guest.chat.saveChat
                            }

                            objParam.data = mess
                            const res = await ChatFunction.findFunction(objParam, this.req!, this.res!, this.next!)
                            // console.log(res)

                            if (res.isError) {

                                // send error
                            }




                            // objParam.Broker = Param.broker.
                        },
                        (err) => {
                            // Socket.SendChatMessageInRoom(SocketKeyName.ReceiveError, err);
                        }
                    );
                    this.objUserResponse = GetUserSuccessObj('Success: Redis service started', HttpStatusCodes.OK);
                } catch (error: any) {
                    this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
                }
            } else {
                this.objUserResponse = GetUserErrorObj(isVerified.error, HttpStatusCodes.NOT_ACCEPTABLE);
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse;
        }
    };
}
