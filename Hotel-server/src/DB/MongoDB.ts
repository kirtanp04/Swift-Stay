import mongoose from 'mongoose';
import { UserResponse, errorPath } from '../common';

export class MongoDB {
    static ConnectDB = async () => {
        let _userRes = new UserResponse();
        try {
            await mongoose.connect(process.env.MNOGO_URL!).then(() => {
                _userRes.isError = false;
                _userRes.data = 'Database Connection: Success';
            });
        } catch (error) {
            _userRes.Message = errorPath('Database/DB.ts', 'ConnectDB', 17) + error;
            _userRes.isError = true;
        } finally {
            console.log(_userRes);
        }
    };
}
