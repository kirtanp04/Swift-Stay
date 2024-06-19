"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("src/Functions/User");
const Crypt_1 = require("src/common/Crypt");
const UserResponse_1 = require("src/middleware/UserResponse");
const BrokerRouter = express_1.default.Router();
const _UserBroker = 'UserBroker';
BrokerRouter.get('/manage/:param', (req, res, next) => {
    const { param } = req.params;
    console.log(param);
    const objDecrypt = Crypt_1.Crypt.Decryption(param);
    const paramObj = objDecrypt.data;
    if (paramObj.Broker === _UserBroker) {
        const _UserFunction = new User_1.UserFunction(paramObj, req, res, next);
        return (0, UserResponse_1.SendResponseToUser)(_UserFunction.objUserResponse, next);
    }
});
BrokerRouter.get('/common/:param', (req, res, next) => {
    const { param } = req.params;
    const objDecrypt = Crypt_1.Crypt.Decryption(param);
    const paramObj = objDecrypt.data;
});
exports.default = BrokerRouter;
