import mongoose from 'mongoose'
// import { SecrtKey } from '../env'
import { UserResponse, errorPath } from '../common'

export class MongoDB {

    private static URL = 'mongodb+srv://kirtanp04:OyBd0kVg6JZxkvpy@hotelcluster.exs9nof.mongodb.net/Stay_Swift';

    static ConnectDB = async () => {
        let _userRes = new UserResponse();
        try {
            await mongoose.connect(this.URL!).then(() => {
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