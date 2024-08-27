import { NextFunction } from 'express';
import mongoose from 'mongoose';
import { UserResponse } from '../common';
import { SecrtKey } from '../env';

export class MongoDB {

    static ConnectDB = async (next: NextFunction): Promise<UserResponse> => {
        let _userRes = new UserResponse();
        if (mongoose.connection.readyState === 0) { // not connected yet
            try {
                await mongoose.connect(SecrtKey.MNOGO_URL!).then(() => {
                    _userRes.isError = false;
                    _userRes.data = 'Database Connection: Success';
                });
            } catch (error: any) {
                _userRes.Message = error;
                _userRes.isError = true;
            }

        }
        return _userRes

    };
}
