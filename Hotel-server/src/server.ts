import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression'
import helmet from 'helmet'
import BrokerRouter from './BrokerRoute/Broker';
import { UserResponse } from './common/Response';
import { SendResponseToUser, UserResponseMiddWare } from './middleware/UserResponse';
import { MainApiLimit } from './middleware/RateLimitApi';

const _app = express()

export class _Express {
  Port: number = 8080;


  constructor() {
    this.middleware()

    this.route()
  }



  middleware() {

    _app.use(cors());

    _app.use(helmet())

    _app.use(bodyParser.json({ limit: '50mb' }));

    _app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 2 }));

    _app.use(express.json({ limit: '50mb' }));

    _app.use(cookieParser())

    _app.use(compression({
      level: 9,
      threshold: 512,
      filter: (req: Request, res: Response) => {
        if (req.headers['x-no-compression']) {
          return false
        }
        return compression.filter(req, res)
      }
    }))
  }

  route() {

    _app.use('/hotel/api', MainApiLimit, BrokerRouter)

    _app.all('*', (req: Request, res: Response, next: NextFunction) => {
      let objUserResponse = new UserResponse()
      objUserResponse.Message = 'API error / Path not found.'
      objUserResponse.isError = true
      objUserResponse.statusCode = 404
      SendResponseToUser(objUserResponse, next)
    })

    _app.use(UserResponseMiddWare) // sending data to user middle ware
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
