import express, { NextFunction, Request, Response, Router } from 'express';
import { Crypt } from '../common/Crypt';
import { SendResponseToUser } from '../middleware/UserResponse';
import { TParam } from '../types/Type';
import * as Functions from '../Functions/index'
import { Param } from '../Constant';
import { MongoDB } from '../DB/MongoDB';
import { GetUserErrorObj, HttpStatusCodes } from '../common';


const GuestBrokerRouter: Router = express.Router();

const _GuestAuthBroker: string = Param.broker.guest.Auth;
const _GuestPropertyBroker: string = Param.broker.guest.Property;
const _GuestRoomBroker: string = Param.broker.guest.Room;

GuestBrokerRouter.get('/:param', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const isDBConnected = await MongoDB.ConnectDB(next)

        if (isDBConnected.isError === false) {
            const { param } = req.params;
            const objDecrypt = Crypt.Decryption(param);

            if (objDecrypt.error === '') {
                const paramObj: TParam = objDecrypt.data;


                if (paramObj.Broker === _GuestPropertyBroker) {
                    const _res = await Functions.PropertyFunction.findFunction(paramObj, req, res, next)
                    return SendResponseToUser(_res, next);
                }


            } else {
                return SendResponseToUser(GetUserErrorObj(`Server Error: ${objDecrypt.error}`, 404), next);
            }
        }

    } catch (error: any) {
        return SendResponseToUser(GetUserErrorObj(`Server Error: ${error.message}`, 404), next);
    }
});

GuestBrokerRouter.post('/:param', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const isDBConnected = await MongoDB.ConnectDB(next)
        if (isDBConnected.isError === false) {
            const { param } = req.params;
            const objDecrypt = Crypt.Decryption(param);

            if (objDecrypt.error === '') {
                const decryptResBody = Crypt.Decryption(req.body.data);

                if (decryptResBody.error === '') {
                    let paramObj: TParam = objDecrypt.data;

                    paramObj.data = decryptResBody.data;

                    if (paramObj.Broker === _GuestAuthBroker) {
                        const _res = await Functions.UserFunction.findFunction(paramObj, req, res, next);
                        return SendResponseToUser(_res, next);
                    }



                    const errMess = GetUserErrorObj('Server error: Wrong Broker', HttpStatusCodes.BAD_REQUEST);
                    return SendResponseToUser(errMess, next);

                } else {
                    const errMess = GetUserErrorObj('Server error: Not able to decrypt body', HttpStatusCodes.BAD_REQUEST);
                    return SendResponseToUser(errMess, next);
                }
            } else {
                return SendResponseToUser(GetUserErrorObj(`Server Error: ${objDecrypt.error} + Params`, 404), next);
            }
        }

    } catch (error: any) {
        return SendResponseToUser(GetUserErrorObj(`Server Error: ${error.message}`, 404), next);
    }
});



export default GuestBrokerRouter;
