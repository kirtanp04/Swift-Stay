import { NextFunction, Request, Response } from 'express';
import { GetUserErrorObj, GetUserSuccessObj, UserResponse } from '../common/Response';
import { TParam } from '../types/Type';
import { Crypt, HttpStatusCodes, Jwt, Storage } from '../common';
import { Login, User, UserClass, enumUserRole } from '../Models/UserModel';

const _CreateGuestAccount: string = 'CreateGuestAccount';

const _CreateManagerAccount: string = 'CreateManagerAccount';

const _GuestLogin: string = 'GuestLogin';

const _ManagerLogin: string = 'ManagerLogin';

export class UserFunction {
    private static objUserResponse: UserResponse = new UserResponse();

    static findFunction = async (objParam: TParam, req: Request, res: Response, next: NextFunction): Promise<UserResponse> => {
        if (objParam.function === _CreateManagerAccount) {
            const _res = await Functions.CreateManagerAccount(req, res, next, objParam);
            this.objUserResponse = _res;
        } else if (objParam.function === _CreateGuestAccount) {
            const _res = await Functions.CreateGuestAccount(req, res, next, objParam);
            this.objUserResponse = _res;
        } else if (objParam.function === _ManagerLogin) {
            const _res = await Functions.ManagerLogin(req, res, next, objParam);
            this.objUserResponse = _res;
        } else if (objParam.function === _GuestLogin) {
            const _res = await Functions.GuestLogin(req, res, next, objParam);
            this.objUserResponse = _res;
        } else {
            this.objUserResponse = GetUserErrorObj('Server error: Wronge Function.', HttpStatusCodes.BAD_REQUEST);
        }

        return this.objUserResponse;
    };
}

class Functions {
    private static objUserResponse: UserResponse = new UserResponse();

    static CreateGuestAccount = async (
        req: Request,
        res: Response,
        next: NextFunction,
        objParam: TParam
    ): Promise<UserResponse> => {
        const { createdAt, email, name, password, phone, profileImg, role } = objParam.data as UserClass;

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

    static GuestLogin = async (req: Request, res: Response, next: NextFunction, objParam: TParam): Promise<UserResponse> => {
        const { email, password } = req.body as Login;

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

    static CreateManagerAccount = async (
        req: Request,
        res: Response,
        next: NextFunction,
        objParam: TParam
    ): Promise<UserResponse> => {
        try {
            const { createdAt, email, name, password, phone, profileImg, role } = objParam.data as UserClass;

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

    static ManagerLogin = async (req: Request, res: Response, next: NextFunction, objParam: TParam): Promise<UserResponse> => {
        try {
            const { email, password } = objParam.data;

            const isUser: UserClass | null = await User.findOne({ email: email });

            if (isUser) {
                const isVerifiePass = await Crypt.compareHash(isUser.password, password);

                if (isVerifiePass.error === '') {
                    if (isUser.role !== enumUserRole.guest) {
                        const getToken = await Jwt.SignJwt({ email: isUser.email, name: isUser.name, profileImg: isUser.profileImg });
                        if (getToken.error === '') {
                            const setCookie = Storage.setCookie('Auth', getToken.data, res);

                            if (setCookie.error === '') {
                                this.objUserResponse = GetUserSuccessObj(
                                    { email: isUser.email, name: isUser.name, profile: isUser.profileImg },
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
