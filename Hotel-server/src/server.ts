import express, { Express, urlencoded } from 'express';
import 'dotenv/config';
import cors from 'cors';
import bodyParser from 'body-parser';
import { UserResponseMiddWare } from './middleware/UserResponse';

export class _Express {
  Port: number = 0;
  private app: Express = express();

  middleware() {
    this.app.use(cors());

    this.app.use(bodyParser.json());

    this.app.use(bodyParser.urlencoded({ extended: true, limit: '10mb', parameterLimit: 2 }));

    this.app.use(express.json());
  }

  route() {
    this.app.use('/hotel/api')

    // this.app.use(UserResponseMiddWare())
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
