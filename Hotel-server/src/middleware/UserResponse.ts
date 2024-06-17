import { NextFunction, Request, Response } from "express";
import { UserResponse } from "src/common/Response";

export const UserResponseMiddWare = (objRes: UserResponse, req: Request, res: Response, next: NextFunction): UserResponse => {
    let Response = new UserResponse()


    return Response
}