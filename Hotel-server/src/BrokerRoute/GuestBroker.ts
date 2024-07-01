import express, { NextFunction, Request, Response, Router } from 'express';
import { Crypt } from '../common/Crypt';
import { SendResponseToUser } from '../middleware/UserResponse';
import { TParam } from '../types/Type';
import * as Functions from '../functions'
import { Param } from '../Constant';


const GuestBrokerRouter: Router = express.Router();

const _GuestAuthBroker: string = Param.broker.guest.Auth;
const _GuestPropertyBroker: string = Param.broker.guest.Property;
const _GuestRoomBroker: string = Param.broker.guest.Room;

GuestBrokerRouter.get('/:param', (req: Request, res: Response, next: NextFunction) => {
    const { param } = req.params;

    console.log(param)


    const objDecrypt = Crypt.Decryption(param);

    console.log(objDecrypt)
    // const paramObj = objDecrypt.data as TParam;

    // if (paramObj.Broker === _GuestBroker) {
    //     const _UserFunction = new Functions.UserFunction(paramObj, req, res, next);
    //     return SendResponseToUser(_UserFunction.objUserResponse, next);
    // }

    // if (paramObj.Broker === _GuestHotelBroker) {
    //     const _HotelFunction = new Functions.HotelFunction(paramObj, req, res, next)
    //     return SendResponseToUser(_HotelFunction.objUserResponse, next)
    // }
});

GuestBrokerRouter.post('/:param', (req: Request, res: Response, next: NextFunction) => {
    const { param } = req.params;
    const objDecrypt = Crypt.Decryption(param);
    const paramObj = objDecrypt.data as TParam;
});



export default GuestBrokerRouter;
