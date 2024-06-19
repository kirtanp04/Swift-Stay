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
exports.UserFunction = void 0;
const Response_1 = require("src/common/Response");
class UserFunction {
    constructor(paramObj, req, res, next) {
        this._CreateUser = 'CreateUser';
        this._UserLogin = 'UserLogin';
        this.req = undefined;
        this.res = undefined;
        this.next = undefined;
        this.objUserResponse = new Response_1.UserResponse();
        this.req = req;
        this.res = res;
        this.next = next;
        if (paramObj.function === this._CreateUser) {
            this.CreateUser();
        }
        if (paramObj.function === this._UserLogin) {
            this.UserLogin();
        }
    }
    CreateUser() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    UserLogin() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.UserFunction = UserFunction;
