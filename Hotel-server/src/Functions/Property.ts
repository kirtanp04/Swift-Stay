import { NextFunction, Request, Response } from "express";
import { UserResponse } from "../common";
import { TParam } from "../types/Type";

export class PropertyFunction {
    protected _CreateHotel: string = 'CreateHotel';

    protected _GetAllHotels: string = 'GetAllHotels';

    protected _GetSingleHotel: string = 'GetSingleHotel';

    // ----------------------------------------------------------------
    protected req: Request | undefined = undefined;

    protected res: Response | undefined = undefined;

    protected next: NextFunction | undefined = undefined;

    // ----------------------------------------------------------------

    objUserResponse: UserResponse = new UserResponse();

    constructor(paramObj: TParam, req: Request, res: Response, next: NextFunction) {
        this.req = req;

        this.res = res;

        this.next = next;


    }
}