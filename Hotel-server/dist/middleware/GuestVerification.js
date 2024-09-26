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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkGuestVerification = void 0;
const UserModel_1 = require("../models/UserModel");
const Response_1 = require("../common/Response");
const checkGuestVerification = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let _res = new Response_1.ProjectResponse();
    try {
        const checkUser = yield UserModel_1.User.findOne({ _id: id });
        if (checkUser) {
            if (checkUser.role === UserModel_1.enumUserRole.guest) {
                const user = checkUser;
                _res.data = user;
            }
            else {
                _res.error = 'Server error: Your are not an guest to perform this call. Login through guest account.';
            }
        }
        else {
            _res.error = 'Server error: You are not authenticated. Create account first.';
        }
    }
    catch (error) {
        _res.error = error.message;
    }
    finally {
        return _res;
    }
    //
});
exports.checkGuestVerification = checkGuestVerification;
