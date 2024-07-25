import { NextFunction, Request, Response } from 'express';
import { GetUserErrorObj, GetUserSuccessObj, UserResponse } from '../common/Response';
import { TParam } from '../types/Type';
import { Crypt, HttpStatusCodes, Jwt, Storage } from '../common';
import { Login, User, UserClass, enumUserRole } from '../models/UserModel';
import { EmailTemplate, Param } from '../Constant';
import { Email } from '../service/Email';

const _CreateGuestAccount: string = Param.function.guest.register;

const _CreateManagerAccount: string = Param.function.manager.register;

const _GuestLogin: string = Param.function.guest.login;

const _ManagerLogin: string = Param.function.manager.login;

const _ManagerEmailVerification: string = Param.function.manager.EmailVerification;

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
        } else if (objParam.function === _ManagerEmailVerification) {
            const _res = await _Function.ManagerEmailVerification();
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
        const { createdAt, email, name, password, phone, profileImg, role, country } = this.objParam!.data as UserClass;

        try {
            const isUser: UserClass | null = await User.findOne({ email: email });

            if (isUser) {
                if (isUser.role === enumUserRole.admin) {
                    this.objUserResponse = GetUserErrorObj(
                        'Email ID already use as Admin Email. Enter another Email ID.',
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
                        country,
                        phone,
                        role,
                        createdAt,
                    });
                    newUser.save();
                    const Token = Jwt.SignJwt({ _id: newUser._id, email: newUser.email }, '5m');
                    if (Token.error === '') {
                        let Mail = new Email({ next: this.next! });
                        Mail.from = 'kirtanpatel6189@gmail.com';
                        Mail.to = email;
                        Mail.subject = 'Email Verification';
                        Mail.html = EmailTemplate.EmailVerification(name, Token.data);

                        let isError: boolean = false;

                        Mail.sendEmail(
                            () => { },
                            (err) => {
                                this.objUserResponse = GetUserErrorObj(err, HttpStatusCodes.BAD_REQUEST);
                                isError = true;
                            }
                        );
                        if (!isError) {
                            this.objUserResponse = GetUserSuccessObj('We have sent an Email for verification.', HttpStatusCodes.CREATED);

                        }
                    } else {
                        this.objUserResponse = GetUserErrorObj(Token.error, HttpStatusCodes.BAD_REQUEST);
                    }

                    //   this.objUserResponse = GetUserSuccessObj('User has been created', HttpStatusCodes.CREATED);
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

                if (isVerifiedPassword.error === '') {

                    if (isUser.isEmailVerified) {
                        if (isUser.role === enumUserRole.guest) {
                            const getToken = await Jwt.SignJwt({
                                email: isUser.email,
                                name: isUser.name,
                                profileImg: isUser.profileImg,
                                role: isUser.role,
                                country: isUser.country
                            });
                            if (getToken.error === '') {
                                const setCookie = Storage.setCookie('Auth', getToken.data, this.res!);

                                if (setCookie.error === '') {
                                    let _Email = new Email({ next: this.next! });

                                    _Email.from = 'kirtanpatel6189@gmail.com';
                                    _Email.to = email;
                                    _Email.subject = 'login Activity';
                                    _Email.html = EmailTemplate.LogedIn(isUser.name);

                                    let isError: boolean = false;

                                    _Email.sendEmail(
                                        () => { },
                                        (err) => {
                                            if (err) {
                                                this.objUserResponse = GetUserErrorObj(err, HttpStatusCodes.BAD_REQUEST);
                                                isError = true;
                                            }
                                        }
                                    );

                                    if (!isError) {
                                        this.objUserResponse = GetUserSuccessObj(
                                            {
                                                email: isUser.email,
                                                name: isUser.name,
                                                profile: isUser.profileImg,
                                                role: isUser.role,
                                                id: isUser._id,
                                                isEmailVerified: isUser.isEmailVerified,
                                                country: isUser.country
                                            },
                                            HttpStatusCodes.ACCEPTED
                                        );
                                    }
                                } else {
                                    this.objUserResponse = GetUserErrorObj('Server error: not able to setcookie', HttpStatusCodes.BAD_REQUEST);
                                }
                            } else {
                                this.objUserResponse = GetUserErrorObj(getToken.error, HttpStatusCodes.BAD_REQUEST);
                            }
                        } else {
                            this.objUserResponse = GetUserErrorObj(
                                'You cannot login through your admin account. Use your guest account / Create new one.',
                                HttpStatusCodes.NOT_ACCEPTABLE
                            );
                        }
                    } else {
                        this.objUserResponse = GetUserErrorObj(
                            'Your Email is not verified. verified your email first.',
                            HttpStatusCodes.NOT_ACCEPTABLE
                        );
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
            const { createdAt, email, name, password, phone, profileImg, role, country } = this.objParam!.data as UserClass;

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
                        country,
                        phone,
                        role,
                        createdAt,
                    });
                    newUser.save();
                    const Token = Jwt.SignJwt({ _id: newUser._id, email: newUser.email }, '5m');

                    if (Token.error === '') {
                        let Mail = new Email({ next: this.next! });
                        Mail.from = 'kirtanpatel6189@gmail.com';
                        Mail.to = email;
                        Mail.subject = 'Email Verification';
                        Mail.html = EmailTemplate.EmailVerification(name, Token.data);

                        let isError: boolean = false;

                        Mail.sendEmail(
                            () => { },
                            (err) => {
                                this.objUserResponse = GetUserErrorObj(err, HttpStatusCodes.BAD_REQUEST);
                                isError = true;
                            }
                        );
                        if (!isError) {
                            this.objUserResponse = GetUserSuccessObj('We have sent an Email for verification.', HttpStatusCodes.CREATED);

                        }
                    } else {
                        this.objUserResponse = GetUserErrorObj(Token.error, HttpStatusCodes.BAD_REQUEST);
                    }
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
                    if (isUser.isEmailVerified) {
                        if (isUser.role === enumUserRole.admin) {
                            const getToken = await Jwt.SignJwt({
                                email: isUser.email,
                                name: isUser.name,
                                profileImg: isUser.profileImg,
                                role: isUser.role,
                            });
                            if (getToken.error === '') {
                                const setCookie = Storage.setCookie('Auth', getToken.data, this.res!);

                                if (setCookie.error === '') {
                                    let _Email = new Email({ next: this.next! });

                                    _Email.from = 'kirtanpatel6189@gmail.com';
                                    _Email.to = email;
                                    _Email.subject = 'login Activity';
                                    _Email.html = EmailTemplate.LogedIn(isUser.name);

                                    let isError: boolean = false;

                                    _Email.sendEmail(
                                        () => { },
                                        (err) => {
                                            if (err) {
                                                this.objUserResponse = GetUserErrorObj(err, HttpStatusCodes.BAD_REQUEST);
                                                isError = true;
                                            }
                                        }
                                    );

                                    if (!isError) {
                                        this.objUserResponse = GetUserSuccessObj(
                                            {
                                                email: isUser.email,
                                                name: isUser.name,
                                                profile: isUser.profileImg,
                                                role: isUser.role,
                                                id: isUser._id,
                                                isEmailVerified: isUser.isEmailVerified,
                                            },
                                            HttpStatusCodes.ACCEPTED
                                        );
                                    }
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
                        this.objUserResponse = GetUserErrorObj(
                            'Your Email is not verified. verified your email first.',
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

    public ManagerEmailVerification = async (): Promise<UserResponse> => {
        try {
            const { token } = this.objParam.data;
            const JwtObj = Jwt.VerifyJwt(token);

            if (JwtObj.error === '') {
                const { _id, email } = JwtObj.data;

                const isUser: UserClass | null = await User.findOne({
                    $and: [
                        {
                            _id: _id,
                        },
                        {
                            email: email,
                        },
                    ],
                });

                if (isUser) {
                    if (isUser?.isEmailVerified === false) {
                        const isUserUpdated = await User.findOneAndUpdate(
                            {
                                $and: [
                                    {
                                        _id: _id,
                                    },
                                    {
                                        email: email,
                                    },
                                ],
                            },
                            {
                                $set: {
                                    isEmailVerified: true,
                                },
                            }
                        );
                        if (isUserUpdated) {
                            this.objUserResponse = GetUserSuccessObj(
                                {
                                    email: isUser.email,
                                    name: isUser.name,
                                    profile: isUser.profileImg,
                                    role: isUser.role,
                                    id: isUser._id,
                                    isEmailVerified: isUser.isEmailVerified,
                                },
                                HttpStatusCodes.ACCEPTED
                            );
                        }
                    } else {
                        this.objUserResponse = GetUserErrorObj('Email is already been verifyed.', HttpStatusCodes.BAD_REQUEST);
                    }
                } else {
                    this.objUserResponse = GetUserErrorObj(
                        'Server Error: No User Found / Invalid Token provided',
                        HttpStatusCodes.BAD_REQUEST
                    );
                }
            } else {
                this.objUserResponse = GetUserErrorObj('Server Error: Invalid Token provided', HttpStatusCodes.BAD_REQUEST);
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse;
        }
    };
}
