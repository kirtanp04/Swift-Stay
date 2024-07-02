import mongoose from 'mongoose';
import { UserResponse, errorPath } from '../common';
import { NextFunction, Request, Response } from 'express';
import { SendResponseToUser } from '../middleware/UserResponse';

export class MongoDB {
    static ConnectDB = async (next: NextFunction): Promise<UserResponse> => {
        let _userRes = new UserResponse();
        if (mongoose.connection.readyState === 0) { // not connected yet
            try {
                await mongoose.connect('mongodb+srv://kirtanp04:OyBd0kVg6JZxkvpy@hotelcluster.exs9nof.mongodb.net/Stay_Swift').then(() => {
                    _userRes.isError = false;
                    _userRes.data = 'Database Connection: Success';
                });
            } catch (error) {
                _userRes.Message = errorPath('Database/DB.ts', 'ConnectDB', 17) + error;
                _userRes.isError = true;
            } finally {
                console.log(_userRes)
                if (_userRes.isError) {

                    SendResponseToUser(_userRes, next);
                }
            }
        }
        return _userRes

    };
}
