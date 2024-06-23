import express, { NextFunction, Request, Response, Router } from 'express';
import { Crypt } from '../common/Crypt';
import { SendResponseToUser } from '../middleware/UserResponse';
import { TParam } from '../types/Type';
import * as Functions from '../Functions';
import { GetUserErrorObj, HttpStatusCodes } from '../common';

const ManagerBrokerRouter: Router = express.Router();

const _ManagerBroker: string = 'ManagerBroker';
const _ManagerHotelBroker: string = 'ManagerHotelBroker';
const _ManagerRoomBroker: string = 'ManagerRoomBroker';

ManagerBrokerRouter.get('/:param', async (req: Request, res: Response, next: NextFunction) => {
  const { param } = req.params;
  const objDecrypt = Crypt.Decryption(param);

  if (objDecrypt.error === '') {
    const paramObj: TParam = objDecrypt.data;

    if (paramObj.Broker === _ManagerBroker) {
      const _res = await Functions.UserFunction.findFunction(paramObj, req, res, next);
      // const _UserFunction = new Functions.UserFunction(paramObj, req, res, next);
      // console.log(_UserFunction)
      // return SendResponseToUser(_UserFunction.objUserResponse, next);
    }

    if (paramObj.Broker === _ManagerHotelBroker) {
      //
    }
  } else {
    return SendResponseToUser(GetUserErrorObj(`Server Error: ${objDecrypt.error}`, 404), next);
  }
});

ManagerBrokerRouter.post('/:param', async (req: Request, res: Response, next: NextFunction) => {
  const { param } = req.params;
  const objDecrypt = Crypt.Decryption(param);

  if (objDecrypt.error === '') {
    const decryptResBody = Crypt.Decryption(req.body.data);

    if (decryptResBody.error === '') {
      let paramObj: TParam = objDecrypt.data;

      paramObj.data = decryptResBody.data;

      if (paramObj.Broker === _ManagerBroker) {
        const _res = await Functions.UserFunction.findFunction(paramObj, req, res, next);
        return SendResponseToUser(_res, next);
      }

      if (paramObj.Broker === _ManagerHotelBroker) {
        //
      }
    } else {
      const errMess = GetUserErrorObj('Server error: Not able to decrypt body', HttpStatusCodes.BAD_REQUEST);
      return SendResponseToUser(errMess, next);
    }
  } else {
    return SendResponseToUser(GetUserErrorObj(`Server Error: ${objDecrypt.error} + Params`, 404), next);
  }
});

export default ManagerBrokerRouter;
