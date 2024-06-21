import express, { NextFunction, Request, Response, Router } from 'express';
import { Crypt } from '../common/Crypt';
import { SendResponseToUser } from '../middleware/UserResponse';
import { TParam } from '../types/Type';
import * as Functions from '../Functions'


const GuestBrokerRouter: Router = express.Router();

const _UserBroker: string = 'UserBroker';
const _HotelBroker: string = 'HotelBroker';
const _RoomBroker: string = 'RoomBroker';

GuestBrokerRouter.get('/:param', (req: Request, res: Response, next: NextFunction) => {
    const { param } = req.params;


    const objDecrypt = Crypt.Decryption(param);
    const paramObj = objDecrypt.data as TParam;

    if (paramObj.Broker === _UserBroker) {
        const _UserFunction = new Functions.UserFunction(paramObj, req, res, next);
        return SendResponseToUser(_UserFunction.objUserResponse, next);
    }

    if (paramObj.Broker === _HotelBroker) {
        const _HotelFunction = new Functions.HotelFunction(paramObj, req, res, next)
        return SendResponseToUser(_HotelFunction.objUserResponse, next)
    }
});



export default GuestBrokerRouter;
