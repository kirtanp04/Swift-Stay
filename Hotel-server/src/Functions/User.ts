import { NextFunction, Request, Response } from 'express';
import { GetUserErrorObj, GetUserSuccessObj, UserResponse } from '../common/Response';
import { TParam } from '../types/Type';
import { Crypt, HttpStatusCodes, Jwt, Storage } from '../common';
import { Login, User, UserClass, enumUserRole } from '../Models/UserModel';
import { Param } from '../Constant';



const _CreateGuestAccount: string = Param.function.guest.register;

const _CreateManagerAccount: string = Param.function.manager.register;

const _GuestLogin: string = Param.function.guest.login;

const _ManagerLogin: string = Param.function.manager.login;

export class UserFunction {
    private static objUserResponse: UserResponse = new UserResponse();

    static findFunction = async (objParam: TParam, req: Request, res: Response, next: NextFunction): Promise<UserResponse> => {
        let _Function = new Functions();
        _Function.req = req;
        _Function.res = res;
        _Function.next = next;
        _Function.objParam = objParam;

        if (objParam.function === _CreateManagerAccount) {
            const _res = await _Function.CreateManagerAccount();
            this.objUserResponse = _res;
        } else if (objParam.function === _CreateGuestAccount) {
            const _res = await _Function.CreateGuestAccount();
            this.objUserResponse = _res;
        } else if (objParam.function === _ManagerLogin) {
            const _res = await _Function.ManagerLogin();
            this.objUserResponse = _res;
        } else if (objParam.function === _GuestLogin) {
            const _res = await _Function.GuestLogin();
            this.objUserResponse = _res;
        } else {
            this.objUserResponse = GetUserErrorObj('Server error: Wronge Function.', HttpStatusCodes.BAD_REQUEST);
        }

        return this.objUserResponse;
    };
}

class Functions {
    private objUserResponse: UserResponse = new UserResponse();

    public req: Request | null = null;

    public res: Response | null = null;

    public next: NextFunction | null = null;

    public objParam: TParam = new TParam();

    public CreateGuestAccount = async (): Promise<UserResponse> => {
        const { createdAt, email, name, password, phone, profileImg, role } = this.objParam!.data as UserClass;

        try {
            const isUser: UserClass | null = await User.findOne({ email: email });

            if (isUser) {
                this.objUserResponse = GetUserErrorObj('Email ID already exist. Enter another Email ID.', HttpStatusCodes.BAD_REQUEST);
            } else {
                const objHashPass = await Crypt.hashValue(password);

                if (objHashPass.error !== '') {
                    this.objUserResponse = GetUserErrorObj(objHashPass.error, HttpStatusCodes.BAD_REQUEST);
                } else {
                    const newUser = await User.create({
                        createdAt,
                        email,
                        name,
                        phone,
                        profileImg,
                        role,
                        password: objHashPass.data,
                    });
                    newUser.save();

                    this.objUserResponse = GetUserSuccessObj('User has been created', HttpStatusCodes.CREATED);
                }
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse;
        }
    };

    public GuestLogin = async (): Promise<UserResponse> => {
        const { email, password } = this.objParam!.data as Login;

        try {
            const isUser: UserClass | null = await User.findOne({ email: email });

            if (!isUser) {
                this.objUserResponse = GetUserErrorObj('User not found, try to login with another Email ID.', HttpStatusCodes.NOT_FOUND);
            } else {
                const isVerifiedPassword = await Crypt.compareHash(isUser.password, password);

                if (isVerifiedPassword) {
                    if (isUser.role === enumUserRole.admin) {
                        this.objUserResponse = GetUserErrorObj(
                            'You cannot login through your admin account. Use your guest account / Create new one.',
                            HttpStatusCodes.NOT_ACCEPTABLE
                        );
                    } else {
                        this.objUserResponse = GetUserSuccessObj('login: Success');
                    }
                } else {
                    this.objUserResponse = GetUserErrorObj('Wrong credentials, enter correct password.', HttpStatusCodes.NOT_ACCEPTABLE);
                }
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse;
        }
    };

    public CreateManagerAccount = async (): Promise<UserResponse> => {
        try {
            const { createdAt, email, name, password, phone, profileImg, role } = this.objParam!.data as UserClass;

            const isUser: UserClass | null = await User.findOne({ email: email });

            if (isUser) {
                if (isUser.role === enumUserRole.guest) {
                    this.objUserResponse = GetUserErrorObj(
                        'You cannot use Email ID which is already been registerd in Guest account. Enter another Email ID.',
                        HttpStatusCodes.BAD_REQUEST
                    );
                } else {
                    this.objUserResponse = GetUserErrorObj('Email ID already exist. Enter another Email ID.', HttpStatusCodes.BAD_REQUEST);
                }
            } else {
                const objHashPass = await Crypt.hashValue(password);

                if (objHashPass.error !== '') {
                    this.objUserResponse = GetUserErrorObj(objHashPass.error, HttpStatusCodes.BAD_REQUEST);
                } else {
                    const newUser = await User.create({
                        name,
                        email,
                        password: objHashPass.data,
                        profileImg,
                        phone,
                        role,
                        createdAt,
                    });
                    newUser.save();

                    this.objUserResponse = GetUserSuccessObj('User has been created', HttpStatusCodes.CREATED);
                }
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse;
        }
    };

    public ManagerLogin = async (): Promise<UserResponse> => {
        try {
            const { email, password } = this.objParam!.data;

            const isUser: UserClass | null = await User.findOne({ email: email });

            if (isUser) {
                const isVerifiePass = await Crypt.compareHash(isUser.password, password);

                if (isVerifiePass.error === '') {
                    if (isUser.role !== enumUserRole.guest) {
                        const getToken = await Jwt.SignJwt({ email: isUser.email, name: isUser.name, profileImg: isUser.profileImg, role: isUser.role });
                        if (getToken.error === '') {
                            const setCookie = Storage.setCookie('Auth', getToken.data, this.res!);

                            if (setCookie.error === '') {
                                this.objUserResponse = GetUserSuccessObj(
                                    { email: isUser.email, name: isUser.name, profile: isUser.profileImg, role: isUser.role },
                                    HttpStatusCodes.ACCEPTED
                                );
                            } else {
                                this.objUserResponse = GetUserErrorObj('Server error: not able to setcookie', HttpStatusCodes.BAD_REQUEST);
                            }
                        } else {
                            this.objUserResponse = GetUserErrorObj(getToken.error, HttpStatusCodes.BAD_REQUEST);
                        }
                    } else {
                        this.objUserResponse = GetUserErrorObj(
                            'You cannot use your guest account for login.',
                            HttpStatusCodes.NOT_ACCEPTABLE
                        );
                    }
                } else {
                    this.objUserResponse = GetUserErrorObj('Invalid Credentials. Enter correct password', HttpStatusCodes.NOT_ACCEPTABLE);
                }
            } else {
                this.objUserResponse = GetUserErrorObj('No User has been found. Create new account.', HttpStatusCodes.NOT_FOUND);
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse;
        }
    };
}
