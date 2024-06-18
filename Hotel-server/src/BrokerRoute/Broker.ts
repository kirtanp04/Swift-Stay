import express, { NextFunction, Request, Response, Router } from 'express'
import { UserFunction } from 'src/Functions/User'
import { Crypt } from 'src/common/Crypt'
import { SendResponseToUser } from 'src/middleware/UserResponse'


const BrokerRouter: Router = express.Router()

const _UserBroker: string = 'UserBroker'


BrokerRouter.get('/manage/:param', (req: Request, res: Response, next: NextFunction) => {
    const { param } = req.params
    const objDecrypt = Crypt.Decryption(param)
    const paramObj = objDecrypt.data as TParam

    if (paramObj.Broker === _UserBroker) {
        const _UserFunction = new UserFunction(paramObj, req, res, next)
        return SendResponseToUser(_UserFunction.objUserResponse, next)
    }

})

BrokerRouter.get('/common/:param', (req: Request, res: Response, next: NextFunction) => {
    const { param } = req.params
    const objDecrypt = Crypt.Decryption(param)
    const paramObj = objDecrypt.data as TParam



})