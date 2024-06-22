import express, { NextFunction, Request, Response, Router } from 'express';
import { Crypt } from '../common/Crypt';
import { SendResponseToUser } from '../middleware/UserResponse';
import { TParam } from '../types/Type';
import * as Functions from '../Functions'


const ManagerBrokerRouter: Router = express.Router();

const _ManagerBroker: string = 'ManagerBroker';
const _ManagerHotelBroker: string = 'ManagerHotelBroker';
const _ManagerRoomBroker: string = 'ManagerRoomBroker';

ManagerBrokerRouter.get('/:param', (req: Request, res: Response, next: NextFunction) => {
    const { param } = req.params;


    const objDecrypt = Crypt.Decryption(param);
    const paramObj = objDecrypt.data as TParam;

    if (paramObj.Broker === _ManagerBroker) {
        const _UserFunction = new Functions.UserFunction(paramObj, req, res, next);
        return SendResponseToUser(_UserFunction.objUserResponse, next);
    }

    if (paramObj.Broker === _ManagerHotelBroker) {
        const _HotelFunction = new Functions.HotelFunction(paramObj, req, res, next)
        return SendResponseToUser(_HotelFunction.objUserResponse, next)
    }
});

ManagerBrokerRouter.post('/:param', (req: Request, res: Response, next: NextFunction) => {
    const { param } = req.params;
    const objDecrypt = Crypt.Decryption(param);
    const paramObj = objDecrypt.data as TParam;
});

export default ManagerBrokerRouter;
