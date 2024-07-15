import { NextFunction, Request, Response } from "express";
import { GetUserErrorObj, HttpStatusCodes, UserResponse } from "../common";
import { Param } from "../Constant";
import { TParam } from "../types/Type";
import { checkAdminVerification } from "../middleware/AdiminVerification";
import { WebSocket } from "../service/Socket";

const _ManagerChatInit: string = Param.function.manager.chat.Init;

export class ChatFunction {
    private static objUserResponse: UserResponse = new UserResponse();

    static findFunction = async (objParam: TParam, req: Request, res: Response, next: NextFunction): Promise<UserResponse> => {
        let _Function = new Functions();
        _Function.req = req;
        _Function.res = res;
        _Function.next = next;
        _Function.objParam = objParam;

        if (objParam.function === _ManagerChatInit) {
            const _res = await _Function.InitManagerChatService();
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

    public InitManagerChatService = async (): Promise<UserResponse> => {

        try {

            const { adminID } = this.objParam.data
            const isValidUser = await checkAdminVerification(adminID)

            if (isValidUser.error === '') {

                const Port: number = 1212

                const Socket = new WebSocket(Port)
                // Socket.Start()


            } else {
                this.objUserResponse = GetUserErrorObj(isValidUser.error, HttpStatusCodes.NOT_ACCEPTABLE);
            }

        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse
        }

    }
}