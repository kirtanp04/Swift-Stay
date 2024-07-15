import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import GuestBrokerRouter from './BrokerRoute/GuestBroker';
import ManagerBrokerRouter from './BrokerRoute/ManagerBroker';
import { UserResponse } from './common/Response';
import { SendResponseToUser, UserResponseMiddWare } from './middleware/UserResponse';
import { MainApiLimit } from './middleware/RateLimitApi';
import { SecrtKey } from './env';
import http from 'http';
import { Server } from 'socket.io';


export const _app = express();

const server = http.createServer(_app);
export const io = new Server(server, {
  cors: {
    credentials: true,
    methods: 'GET,POST',
    optionsSuccessStatus: 201,
    origin: SecrtKey.FRONTEND_URL,
  }
});

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
      server.listen(this.Port, () => {
        console.log('Server started on Port' + this.Port);
      });

    } catch (error) {
      console.log('Error while Starting Server -> ' + error);
    }
  }
}
