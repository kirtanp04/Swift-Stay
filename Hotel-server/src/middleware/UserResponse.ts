import { NextFunction, Request, Response } from "express";
import { Crypt } from "../common/Crypt";
import { UserResponse } from "../common/Response";

export const UserResponseMiddWare = (objRes: UserResponse, req: Request, res: Response, next: NextFunction) => {
    const encryptedData = Crypt.Encryption(objRes)

    if (encryptedData.error === '') {
        res.status(objRes.statusCode).send(encryptedData.data)
    } else {
        res.status(404).send(encryptedData.error)
    }
}


export const SendResponseToUser = (objRes: UserResponse, next: NextFunction) => {
    next(objRes)
}