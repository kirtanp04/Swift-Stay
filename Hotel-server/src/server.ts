import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import GuestBrokerRouter from './BrokerRoute/GuestBroker';
import ManagerBrokerRouter from './BrokerRoute/ManagerBroker';
import { UserResponse } from './common/Response';
import { Param } from './Constant';
import { MongoDB } from './DB/MongoDB';
import { SecrtKey } from './env';
import { PaymentFunction } from './Functions';
import { MainApiLimit } from './middleware/RateLimitApi';
import { SendResponseToUser, UserResponseMiddWare } from './middleware/UserResponse';
import { TParam } from './types/Type';

export const _app = express();

export class _Express {
  Port: number = 8080;

  constructor() {
    this.middleware();

    this.route();
  }

  middleware() {
    _app.use(
      compression({
        level: 9,
        threshold: 512,
        filter: (req: Request, res: Response) => {
          if (req.headers['x-no-compression']) {
            return false;
          }
          return compression.filter(req, res);
        },
      })
    );

    _app.use(
      cors({
        credentials: true,
        methods: 'GET,POST',
        optionsSuccessStatus: 201,
        origin: [SecrtKey.FRONTEND_URL.ADMIN, SecrtKey.FRONTEND_URL.GUEST],
        // origin: [SecrtKey.FRONTEND_URL.ADMIN, SecrtKey.FRONTEND_URL.GUEST],
      })
    );

    _app.use(helmet());

    _app.use(bodyParser.json({ limit: '50mb' }));

    _app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 2 }));

    _app.use(express.json({ limit: '50mb' }));

    _app.use(cookieParser());

    _app.use(bodyParser.raw({ type: 'application/json' }));


  }

  route() {
    _app.use('/swiftstay/guest/api', MainApiLimit, GuestBrokerRouter);

    _app.use('/swiftstay/manager/api', MainApiLimit, ManagerBrokerRouter);

    _app.post('/swiftstay/guest/webhook', async (req, res, next) => {
      try {
        const isDBConnected = await MongoDB.ConnectDB(next);

        if (!isDBConnected.isError) {
          const param = new TParam()
          param.function = Param.function.guest.payment.WebHook
          param.data = req.body
          return SendResponseToUser(await PaymentFunction.findFunction(param, req, res, next), next);
        } else {
          let objUserResponse = new UserResponse();
          objUserResponse.Message = 'not able to connect to DB';
          objUserResponse.isError = true;
          objUserResponse.statusCode = 404;
          SendResponseToUser(objUserResponse, next);
          return SendResponseToUser(objUserResponse, next);
        }


      } catch (error: any) {
        let objUserResponse = new UserResponse();
        objUserResponse.Message = error.message;
        objUserResponse.isError = true;
        objUserResponse.statusCode = 404;
        SendResponseToUser(objUserResponse, next);
        return SendResponseToUser(objUserResponse, next);
      }
    });

    _app.all('*', (req: Request, res: Response, next: NextFunction) => {
      let objUserResponse = new UserResponse();
      objUserResponse.Message = 'API error / Path not found.';
      objUserResponse.isError = true;
      objUserResponse.statusCode = 404;
      SendResponseToUser(objUserResponse, next);
    });

    _app.use(UserResponseMiddWare); // sending data to user middle ware
  }

  listen() {
    try {
      _app.listen(this.Port, () => {
        console.log('Server started on Port' + this.Port);
      });
    } catch (error) {
      console.log('Error while Starting Server -> ' + error);
    }
  }
}
