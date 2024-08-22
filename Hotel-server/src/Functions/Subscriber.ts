import { NextFunction, Request, Response } from "express";
import { Cache, GetUserErrorObj, GetUserSuccessObj, HttpStatusCodes, UserResponse } from "../common";
import { CacheKey, Param } from "../Constant";
import { TParam } from "../types/Type";
import { checkAdminVerification } from "../middleware/AdiminVerification";
import { Subscriber } from "../models/Subscriber";


const _ManagergellAllSubscriberList: string = Param.function.manager.subscriber.GetAllSubscriber;

export class SubscriberFunction {
    private static objUserResponse: UserResponse = new UserResponse();

    static findFunction = async (objParam: TParam, req: Request, res: Response, next: NextFunction): Promise<UserResponse> => {
        let _Function = new Functions();
        _Function.req = req;
        _Function.res = res;
        _Function.next = next;
        _Function.objParam = objParam;

        if (objParam.function === _ManagergellAllSubscriberList) {
            const _res = await _Function.GetAllSubscriberList();
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

    public GetAllSubscriberList = async (): Promise<UserResponse> => {

        try {

            const id = this.objParam!.data;


            const checkUser = await checkAdminVerification(id);

            if (checkUser.error === '') {
                const ManagerSubscribersCache = Cache.getCacheData(CacheKey.manager.subscriber(checkUser.data.email));

                if (ManagerSubscribersCache.error === '') {
                    this.objUserResponse = GetUserSuccessObj(ManagerSubscribersCache.data, HttpStatusCodes.OK);
                } else {

                    const SubscriberList = await Subscriber.find({ adminID: id }).populate('subscribers').exec()


                    if (SubscriberList) {
                        Cache.SetCache(CacheKey.manager.subscriber(checkUser.data.email), SubscriberList);
                        this.objUserResponse = GetUserSuccessObj(SubscriberList, HttpStatusCodes.OK);
                    }
                }


            } else {
                this.objUserResponse = GetUserErrorObj(checkUser.error, HttpStatusCodes.NOT_ACCEPTABLE);
            }

        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse
        }

    }
}