import { User, UserClass, enumUserRole } from '../models/UserModel';
import { ProjectResponse } from '../common/Response';

export const checkGuestVerification = async (id: string): Promise<ProjectResponse> => {
    let _res = new ProjectResponse();

    try {
        const checkUser = await User.findOne({ _id: id });

        if (checkUser) {

            if (checkUser.role === enumUserRole.guest) {
                const user: UserClass = checkUser

                _res.data = user;
            } else {
                _res.error = 'Server error: Your are not an guest to perform this call. Login through guest account.'
            }
        } else {
            _res.error = 'Server error: You are not authenticated. Create account first.';
        }
    } catch (error: any) {
        _res.error = error.message;
    } finally {
        return _res;
    }

    //
};
