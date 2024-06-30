"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFunction = void 0;
const Response_1 = require("../common/Response");
const Type_1 = require("../types/Type");
const common_1 = require("../common");
const UserModel_1 = require("../Models/UserModel");
const Constant_1 = require("../Constant");
const _CreateGuestAccount = Constant_1.Param.function.guest.register;
const _CreateManagerAccount = Constant_1.Param.function.manager.register;
const _GuestLogin = Constant_1.Param.function.guest.login;
const _ManagerLogin = Constant_1.Param.function.manager.login;
class UserFunction {
}
exports.UserFunction = UserFunction;
_a = UserFunction;
UserFunction.objUserResponse = new Response_1.UserResponse();
UserFunction.findFunction = (objParam, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let _Function = new Functions();
    _Function.req = req;
    _Function.res = res;
    _Function.next = next;
    _Function.objParam = objParam;
    if (objParam.function === _CreateManagerAccount) {
        const _res = yield _Function.CreateManagerAccount();
        _a.objUserResponse = _res;
    }
    else if (objParam.function === _CreateGuestAccount) {
        const _res = yield _Function.CreateGuestAccount();
        _a.objUserResponse = _res;
    }
    else if (objParam.function === _ManagerLogin) {
        const _res = yield _Function.ManagerLogin();
        _a.objUserResponse = _res;
    }
    else if (objParam.function === _GuestLogin) {
        const _res = yield _Function.GuestLogin();
        _a.objUserResponse = _res;
    }
    else {
        _a.objUserResponse = (0, Response_1.GetUserErrorObj)('Server error: Wronge Function.', common_1.HttpStatusCodes.BAD_REQUEST);
    }
    return _a.objUserResponse;
});
class Functions {
    constructor() {
        this.objUserResponse = new Response_1.UserResponse();
        this.req = null;
        this.res = null;
        this.next = null;
        this.objParam = new Type_1.TParam();
        this.CreateGuestAccount = () => __awaiter(this, void 0, void 0, function* () {
            const { createdAt, email, name, password, phone, profileImg, role } = this.objParam.data;
            try {
                const isUser = yield UserModel_1.User.findOne({ email: email });
                if (isUser) {
                    this.objUserResponse = (0, Response_1.GetUserErrorObj)('Email ID already exist. Enter another Email ID.', common_1.HttpStatusCodes.BAD_REQUEST);
                }
                else {
                    const objHashPass = yield common_1.Crypt.hashValue(password);
                    if (objHashPass.error !== '') {
                        this.objUserResponse = (0, Response_1.GetUserErrorObj)(objHashPass.error, common_1.HttpStatusCodes.BAD_REQUEST);
                    }
                    else {
                        const newUser = yield UserModel_1.User.create({
                            createdAt,
                            email,
                            name,
                            phone,
                            profileImg,
                            role,
                            password: objHashPass.data,
                        });
                        newUser.save();
                        this.objUserResponse = (0, Response_1.GetUserSuccessObj)('User has been created', common_1.HttpStatusCodes.CREATED);
                    }
                }
            }
            catch (error) {
                this.objUserResponse = (0, Response_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_REQUEST);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.GuestLogin = () => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = this.objParam.data;
            try {
                const isUser = yield UserModel_1.User.findOne({ email: email });
                if (!isUser) {
                    this.objUserResponse = (0, Response_1.GetUserErrorObj)('User not found, try to login with another Email ID.', common_1.HttpStatusCodes.NOT_FOUND);
                }
                else {
                    const isVerifiedPassword = yield common_1.Crypt.compareHash(isUser.password, password);
                    if (isVerifiedPassword) {
                        if (isUser.role === UserModel_1.enumUserRole.admin) {
                            this.objUserResponse = (0, Response_1.GetUserErrorObj)('You cannot login through your admin account. Use your guest account / Create new one.', common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                        }
                        else {
                            this.objUserResponse = (0, Response_1.GetUserSuccessObj)('login: Success');
                        }
                    }
                    else {
                        this.objUserResponse = (0, Response_1.GetUserErrorObj)('Wrong credentials, enter correct password.', common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                    }
                }
            }
            catch (error) {
                this.objUserResponse = (0, Response_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_REQUEST);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.CreateManagerAccount = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const { createdAt, email, name, password, phone, profileImg, role } = this.objParam.data;
                const isUser = yield UserModel_1.User.findOne({ email: email });
                if (isUser) {
                    if (isUser.role === UserModel_1.enumUserRole.guest) {
                        this.objUserResponse = (0, Response_1.GetUserErrorObj)('You cannot use Email ID which is already been registerd in Guest account. Enter another Email ID.', common_1.HttpStatusCodes.BAD_REQUEST);
                    }
                    else {
                        this.objUserResponse = (0, Response_1.GetUserErrorObj)('Email ID already exist. Enter another Email ID.', common_1.HttpStatusCodes.BAD_REQUEST);
                    }
                }
                else {
                    const objHashPass = yield common_1.Crypt.hashValue(password);
                    if (objHashPass.error !== '') {
                        this.objUserResponse = (0, Response_1.GetUserErrorObj)(objHashPass.error, common_1.HttpStatusCodes.BAD_REQUEST);
                    }
                    else {
                        const newUser = yield UserModel_1.User.create({
                            name,
                            email,
                            password: objHashPass.data,
                            profileImg,
                            phone,
                            role,
                            createdAt,
                        });
                        newUser.save();
                        this.objUserResponse = (0, Response_1.GetUserSuccessObj)('User has been created', common_1.HttpStatusCodes.CREATED);
                    }
                }
            }
            catch (error) {
                this.objUserResponse = (0, Response_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_REQUEST);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.ManagerLogin = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = this.objParam.data;
                const isUser = yield UserModel_1.User.findOne({ email: email });
                if (isUser) {
                    const isVerifiePass = yield common_1.Crypt.compareHash(isUser.password, password);
                    if (isVerifiePass.error === '') {
                        if (isUser.role !== UserModel_1.enumUserRole.guest) {
                            const getToken = yield common_1.Jwt.SignJwt({ email: isUser.email, name: isUser.name, profileImg: isUser.profileImg, role: isUser.role });
                            if (getToken.error === '') {
                                const setCookie = common_1.Storage.setCookie('Auth', getToken.data, this.res);
                                if (setCookie.error === '') {
                                    this.objUserResponse = (0, Response_1.GetUserSuccessObj)({ email: isUser.email, name: isUser.name, profile: isUser.profileImg, role: isUser.role }, common_1.HttpStatusCodes.ACCEPTED);
                                }
                                else {
                                    this.objUserResponse = (0, Response_1.GetUserErrorObj)('Server error: not able to setcookie', common_1.HttpStatusCodes.BAD_REQUEST);
                                }
                            }
                            else {
                                this.objUserResponse = (0, Response_1.GetUserErrorObj)(getToken.error, common_1.HttpStatusCodes.BAD_REQUEST);
                            }
                        }
                        else {
                            this.objUserResponse = (0, Response_1.GetUserErrorObj)('You cannot use your guest account for login.', common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                        }
                    }
                    else {
                        this.objUserResponse = (0, Response_1.GetUserErrorObj)('Invalid Credentials. Enter correct password', common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                    }
                }
                else {
                    this.objUserResponse = (0, Response_1.GetUserErrorObj)('No User has been found. Create new account.', common_1.HttpStatusCodes.NOT_FOUND);
                }
            }
            catch (error) {
                this.objUserResponse = (0, Response_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_REQUEST);
            }
            finally {
                return this.objUserResponse;
            }
        });
    }
}
