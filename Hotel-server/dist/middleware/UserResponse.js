"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendResponseToUser = exports.UserResponseMiddWare = void 0;
const Crypt_1 = require("../common/Crypt");
const UserResponseMiddWare = (objRes, req, res, next) => {
    const encryptedData = Crypt_1.Crypt.Encryption(objRes);
    if (encryptedData.error === '') {
        res.status(objRes.statusCode).send(encryptedData.data);
    }
    else {
        res.status(404).send(encryptedData.error);
    }
};
exports.UserResponseMiddWare = UserResponseMiddWare;
const SendResponseToUser = (objRes, next) => {
    next(objRes);
};
exports.SendResponseToUser = SendResponseToUser;
