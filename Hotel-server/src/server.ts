import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { Express, NextFunction, Request, Response } from 'express';
import { UserResponse } from './common/Response';
import { SendResponseToUser, UserResponseMiddWare } from './middleware/UserResponse';

export class _Express {
  Port: number = 0;
  private app: Express = express();

  middleware() {
    this.app.use(cors());

    this.app.use(bodyParser.json());

    this.app.use(bodyParser.urlencoded({ extended: true, limit: '10mb', parameterLimit: 2 }));

    this.app.use(express.json());

    this.app.use(cookieParser())
  }

  route() {
    this.app.use('/hotel/api')

    this.app.all('*', (req: Request, res: Response, next: NextFunction) => {
      let objUserResponse = new UserResponse()
      objUserResponse.Message = 'API error / Path not found.'
      objUserResponse.isError = true
      objUserResponse.statusCode = 404

      SendResponseToUser(objUserResponse, next)
    })

    this.app.use(UserResponseMiddWare) // sending data to user middle ware
  }

  listen() {
    try {
      this.app.listen(this.Port, () => {
        console.log('Server started on Port' + this.Port);
      });
    } catch (error) {
      console.log('Error while Starting Server -> ' + error);
    }
  }
}
