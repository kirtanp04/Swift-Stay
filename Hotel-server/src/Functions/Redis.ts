import { NextFunction, Request, Response } from 'express';
import { GetUserErrorObj, GetUserSuccessObj, HttpStatusCodes, UserResponse } from '../common';
import { Param } from '../Constant';
import { TParam } from '../types/Type';
import { checkGuestVerification } from '../middleware/GuestVerification';
import { Redis } from '../service/Redis';

// guest
const _GuestInitRedis = Param.function.guest.redis.initRedis;

// Admin
const _ManagerInitRedis = Param.function.guest.redis.initRedis;

export class RedisFunction {
    private static objUserResponse: UserResponse = new UserResponse();

    static findFunction = async (objParam: TParam, req: Request, res: Response, next: NextFunction): Promise<UserResponse> => {
        let _Function = new Functions();
        _Function.req = req;
        _Function.res = res;
        _Function.next = next;
        _Function.objParam = objParam;

        if (objParam.function === _GuestInitRedis) {
            const _res = await _Function.InitRedisService();
            this.objUserResponse = _res;
        } else if (objParam.function === _ManagerInitRedis) {
            const _res = await _Function.InitRedisService();
            this.objUserResponse = _res;
        } else {
            this.objUserResponse = GetUserErrorObj('Server error: Wronge Function.', HttpStatusCodes.BAD_REQUEST);
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
            const id = this.objParam.data;

            const isGuest = await checkGuestVerification(id);

            if (isGuest.error === '') {
                try {
                    const _Redis = new Redis();
                    _Redis.connect();



                    _Redis.subscribeUserChat((mess) => {

                    }, (err) => {
                        // Socket.SendChatMessageInRoom(SocketKeyName.ReceiveError, err);
                    })
                    this.objUserResponse = GetUserSuccessObj('Success: Redis service started', HttpStatusCodes.OK);
                } catch (error: any) {
                    this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
                }
            } else {
                this.objUserResponse = GetUserErrorObj(isGuest.error, HttpStatusCodes.NOT_ACCEPTABLE);
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse;
        }
    };
}
