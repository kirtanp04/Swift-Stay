import express, { NextFunction, Request, Response, Router } from 'express';
import { GetUserErrorObj, HttpStatusCodes } from '../common';
import { Crypt } from '../common/Crypt';
import { Param } from '../Constant';
import { MongoDB } from '../DB/MongoDB';
import * as Functions from '../Functions/index';
import { SendResponseToUser } from '../middleware/UserResponse';
import { TParam } from '../types/Type';

const ManagerBrokerRouter: Router = express.Router();

const _ManagerAuthBroker: string = Param.broker.manager.Auth;
const _ManagerPropertyBroker: string = Param.broker.manager.Property;
const _ManagerRoomBroker: string = Param.broker.manager.Room;
const _ManagerChatBroker: string = Param.broker.manager.chat;
const _ManagerReviewBroker: string = Param.broker.manager.review;
const _ManagerRedisBroker: string = Param.broker.manager.Redis;
const _ManagerBookingBroker: string = Param.broker.manager.booking;

ManagerBrokerRouter.get('/:param', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isDBConnected = await MongoDB.ConnectDB(next);

    if (isDBConnected.isError === false) {
      const { param } = req.params;
      const objDecrypt = Crypt.Decryption(param);

      if (objDecrypt.error === '') {
        const paramObj: TParam = objDecrypt.data;

        switch (paramObj.Broker) {
          case _ManagerAuthBroker:
            return SendResponseToUser(await Functions.UserFunction.findFunction(paramObj, req, res, next), next);

          case _ManagerPropertyBroker:
            return SendResponseToUser(await Functions.PropertyFunction.findFunction(paramObj, req, res, next), next);

          case _ManagerChatBroker:
            return SendResponseToUser(await Functions.SubscriberFunction.findFunction(paramObj, req, res, next), next);

          case _ManagerRoomBroker:
            return SendResponseToUser(await Functions.RoomFunction.findFunction(paramObj, req, res, next), next);

          case _ManagerReviewBroker:
            return SendResponseToUser(await Functions.ReviewFunction.findFunction(paramObj, req, res, next), next);

          case _ManagerRedisBroker:
            return SendResponseToUser(await Functions.RedisFunction.findFunction(paramObj, req, res, next), next);

          case _ManagerBookingBroker:
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

ManagerBrokerRouter.post('/:param', async (req: Request, res: Response, next: NextFunction) => {
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
            case _ManagerAuthBroker:
              return SendResponseToUser(await Functions.UserFunction.findFunction(paramObj, req, res, next), next);

            case _ManagerPropertyBroker:
              return SendResponseToUser(await Functions.PropertyFunction.findFunction(paramObj, req, res, next), next);

            case _ManagerRoomBroker:
              return SendResponseToUser(await Functions.RoomFunction.findFunction(paramObj, req, res, next), next);

            case _ManagerBookingBroker:
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
        return SendResponseToUser(
          GetUserErrorObj(`Server Error: ${objDecrypt.error} + Params`, HttpStatusCodes.BAD_REQUEST),
          next
        );
      }
    } else {
      return SendResponseToUser(GetUserErrorObj(` ${isDBConnected.Message}`, HttpStatusCodes.BAD_REQUEST), next);
    }
  } catch (error: any) {
    return SendResponseToUser(GetUserErrorObj(`Server Error: ${error.message}`, HttpStatusCodes.BAD_REQUEST), next);
  }
});

export default ManagerBrokerRouter;
