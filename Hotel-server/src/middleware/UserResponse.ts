import { NextFunction, Request, Response } from "express";
import { Crypt } from "../common/Crypt";
import { UserResponse } from "../common/Response";

export const UserResponseMiddWare = (objRes: UserResponse, req: Request, res: Response, next: NextFunction) => {
    const encryptedData = Crypt.Encryption(objRes)

    const objDecrypt = Crypt.Decryption(encryptedData.data)

    if (encryptedData.error === '') {
        res.status(objRes.statusCode).json(objDecrypt.data)
    } else {
        res.status(404).json({ message: encryptedData.error })
    }
}


export const SendResponseToUser = (objRes: UserResponse, next: NextFunction) => {
    next(objRes)
}