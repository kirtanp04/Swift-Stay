import { NextFunction, Request, Response } from "express";
import { Param } from "../Constant";
import { TParam } from "../types/Type";
import { HttpStatusCodes, GetUserErrorObj, UserResponse } from "../common";
import { RoomClass } from "../models/RoomModel";
import { checkAdminVerification } from "../middleware/AdiminVerification";


const _AddRoom = Param.function.manager.Room.AddRoom
const _UpdateRoom = Param.function.manager.Room.UpdateRoom
const _DeleteRoom = Param.function.manager.Room.DeleteRoom

export class RoomFunction {
    private static objUserResponse: UserResponse = new UserResponse();

    static findFunction = async (objParam: TParam, req: Request, res: Response, next: NextFunction): Promise<UserResponse> => {
        let _Function = new Functions();
        _Function.req = req;
        _Function.res = res;
        _Function.next = next;
        _Function.objParam = objParam;

        if (objParam.function === _AddRoom) {
            const _res = await _Function.addRoom();
            this.objUserResponse = _res;
        } else {
            this.objUserResponse = GetUserErrorObj('Server error: Wronge Function.', HttpStatusCodes.BAD_REQUEST);
        }


        return this.objUserResponse;

    }

}


class Functions {
    private objUserResponse: UserResponse = new UserResponse();

    public req: Request | null = null;

    public res: Response | null = null;

    public next: NextFunction | null = null;

    public objParam: TParam = new TParam();

    public addRoom = async (): Promise<UserResponse> => {
        try {

            const { adminID, amenities, createdAt, description, isAvailable, maxOccupancy, price, property, roomNumber, type, updatedAt } = this.objParam.data as RoomClass

            const isUser = await checkAdminVerification(adminID)

            if (isUser.error === '') {

                //delete room cach fro property adding

            } else {
                this.objUserResponse = GetUserErrorObj(isUser.error, HttpStatusCodes.NOT_ACCEPTABLE);
            }



        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse
        }
    }


}