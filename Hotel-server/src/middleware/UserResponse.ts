import { NextFunction, Request, Response } from "express";
import { Crypt } from "src/common/Crypt";
import { UserResponse } from "src/common/Response";

export const UserResponseMiddWare = (objRes: UserResponse, req: Request, res: Response, next: NextFunction) => {
    const encryptedData = Crypt.Encryption(objRes)

    if (encryptedData) {
        res.status(objRes.statusCode).json(encryptedData)
    } else {
        res.status(404).json({ message: 'Server Error: Not able to encrypt data while sending data from server.' })
    }
}


export const SendResponseToUser = (objRes: UserResponse, next: NextFunction) => {
    next(objRes)
}