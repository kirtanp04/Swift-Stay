import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import GuestBrokerRouter from './BrokerRoute/GuestBroker';
import ManagerBrokerRouter from './BrokerRoute/ManagerBroker';
import { UserResponse } from './common/Response';
import { SecrtKey } from './env';
import { MainApiLimit } from './middleware/RateLimitApi';
import { SendResponseToUser, UserResponseMiddWare } from './middleware/UserResponse';

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
        origin: SecrtKey.FRONTEND_URL,
      })
    );

    _app.use(helmet());

    _app.use(bodyParser.json({ limit: '50mb' }));

    _app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 2 }));

    _app.use(express.json({ limit: '50mb' }));

    _app.use(cookieParser());
  }

  route() {
    _app.use('/swiftstay/guest/api', MainApiLimit, GuestBrokerRouter);

    _app.use('/swiftstay/manager/api', MainApiLimit, ManagerBrokerRouter);

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
