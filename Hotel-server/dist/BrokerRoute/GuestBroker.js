"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Crypt_1 = require("../common/Crypt");
const Constant_1 = require("../Constant");
const GuestBrokerRouter = express_1.default.Router();
const _GuestAuthBroker = Constant_1.Param.broker.guest.Auth;
const _GuestPropertyBroker = Constant_1.Param.broker.guest.Property;
const _GuestRoomBroker = Constant_1.Param.broker.guest.Room;
GuestBrokerRouter.get('/:param', (req, res, next) => {
    const { param } = req.params;
    console.log(param);
    const objDecrypt = Crypt_1.Crypt.Decryption(param);
    console.log(objDecrypt);
    // const paramObj = objDecrypt.data as TParam;
    // if (paramObj.Broker === _GuestBroker) {
    //     const _UserFunction = new Functions.UserFunction(paramObj, req, res, next);
    //     return SendResponseToUser(_UserFunction.objUserResponse, next);
    // }
    // if (paramObj.Broker === _GuestHotelBroker) {
    //     const _HotelFunction = new Functions.HotelFunction(paramObj, req, res, next)
    //     return SendResponseToUser(_HotelFunction.objUserResponse, next)
    // }
});
GuestBrokerRouter.post('/:param', (req, res, next) => {
    const { param } = req.params;
    const objDecrypt = Crypt_1.Crypt.Decryption(param);
    const paramObj = objDecrypt.data;
});
exports.default = GuestBrokerRouter;
