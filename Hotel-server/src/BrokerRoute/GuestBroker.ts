import express, { NextFunction, Request, Response, Router } from 'express';
import { Crypt } from '../common/Crypt';
import { SendResponseToUser } from '../middleware/UserResponse';
import { TParam } from '../types/Type';
import * as Functions from '../Functions/index';
import { Param } from '../Constant';
import { MongoDB } from '../DB/MongoDB';
import { GetUserErrorObj, HttpStatusCodes } from '../common';

const GuestBrokerRouter: Router = express.Router();
const _GuestAuthBroker: string = Param.broker.guest.Auth;
const _GuestPropertyBroker: string = Param.broker.guest.Property;
const _GuestRoomBroker: string = Param.broker.guest.Room;
const _GuestChatBroker: string = Param.broker.guest.chat;
const _GuestRedisBroker: string = Param.broker.guest.Redis;
const _GuestPaymentBroker: string = Param.broker.guest.payment;
const _GuestBookingBroker: string = Param.broker.guest.booking;

GuestBrokerRouter.get('/:param', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const isDBConnected = await MongoDB.ConnectDB(next);



        if (isDBConnected.isError === false) {
            const { param } = req.params;
            const objDecrypt = Crypt.Decryption(param);

            if (objDecrypt.error === '') {
                const paramObj: TParam = objDecrypt.data;

                switch (paramObj.Broker) {
                    case _GuestAuthBroker:
                        return SendResponseToUser(await Functions.UserFunction.findFunction(paramObj, req, res, next), next);

                    case _GuestRedisBroker:
                        return SendResponseToUser(await Functions.RedisFunction.findFunction(paramObj, req, res, next), next);

                    case _GuestPaymentBroker:
                        return SendResponseToUser(await Functions.PaymentFunction.findFunction(paramObj, req, res, next), next);

                    case _GuestRoomBroker:
                        return SendResponseToUser(await Functions.RoomFunction.findFunction(paramObj, req, res, next), next);

                    case _GuestPropertyBroker:
                        return SendResponseToUser(await Functions.PropertyFunction.findFunction(paramObj, req, res, next), next);

                    case _GuestBookingBroker:
                        return SendResponseToUser(await Functions.BookingFunction.findFunction(paramObj, req, res, next), next);

                    default:
                        const errMess = GetUserErrorObj('Server error: Wrong Broker', HttpStatusCodes.BAD_REQUEST);
                        return SendResponseToUser(errMess, next);
                }
            } else {
                return SendResponseToUser(GetUserErrorObj(`Server Error: ${objDecrypt.error}`, HttpStatusCodes.BAD_REQUEST), next);
            }
        } else {
            return SendResponseToUser(GetUserErrorObj(` ${isDBConnected.Message}`, HttpStatusCodes.BAD_REQUEST), next);
        }
    } catch (error: any) {
        return SendResponseToUser(GetUserErrorObj(`Server Error: ${error.message}`, HttpStatusCodes.BAD_REQUEST), next);
    }
});

GuestBrokerRouter.post('/:param', async (req: Request, res: Response, next: NextFunction) => {
    try {

        const isDBConnected = await MongoDB.ConnectDB(next);
        if (isDBConnected.isError === false) {
            const { param } = req.params;
            const objDecrypt = Crypt.Decryption(param);

            if (objDecrypt.error === '') {
                const decryptResBody = Crypt.Decryption(req.body.data);

                if (decryptResBody.error === '') {
                    let paramObj: TParam = objDecrypt.data;

                    paramObj.data = decryptResBody.data;


                    switch (paramObj.Broker) {
                        case _GuestAuthBroker:
                            return SendResponseToUser(await Functions.UserFunction.findFunction(paramObj, req, res, next), next);

                        case _GuestRedisBroker:
                            return SendResponseToUser(await Functions.RedisFunction.findFunction(paramObj, req, res, next), next);

                        case _GuestPaymentBroker:
                            return SendResponseToUser(await Functions.PaymentFunction.findFunction(paramObj, req, res, next), next);

                        case _GuestRoomBroker:
                            return SendResponseToUser(await Functions.RoomFunction.findFunction(paramObj, req, res, next), next);

                        case _GuestBookingBroker:
                            return SendResponseToUser(await Functions.BookingFunction.findFunction(paramObj, req, res, next), next);

                        default:
                            const errMess = GetUserErrorObj('Server error: Wrong Broker', HttpStatusCodes.BAD_REQUEST);
                            return SendResponseToUser(errMess, next);
                    }
                } else {
                    const errMess = GetUserErrorObj('Server error: Not able to decrypt body', HttpStatusCodes.BAD_REQUEST);
                    return SendResponseToUser(errMess, next);
                }
            } else {
                return SendResponseToUser(GetUserErrorObj(`Server Error: ${objDecrypt.error} + Params`, HttpStatusCodes.BAD_REQUEST), next);
            }
        } else {
            return SendResponseToUser(GetUserErrorObj(` ${isDBConnected.Message}`, HttpStatusCodes.BAD_REQUEST), next);
        }
    } catch (error: any) {
        return SendResponseToUser(GetUserErrorObj(`Server Error: ${error.message}`, HttpStatusCodes.BAD_REQUEST), next);
    }
});

export default GuestBrokerRouter;
