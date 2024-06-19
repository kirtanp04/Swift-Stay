"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendResponseToUser = exports.UserResponseMiddWare = void 0;
const Crypt_1 = require("../common/Crypt");
const UserResponseMiddWare = (objRes, req, res, next) => {
    const encryptedData = Crypt_1.Crypt.Encryption(objRes);
    if (encryptedData) {
        res.status(objRes.statusCode).json(encryptedData);
    }
    else {
        res.status(404).json({ message: 'Server Error: Not able to encrypt data while sending data from server.' });
    }
};
exports.UserResponseMiddWare = UserResponseMiddWare;
const SendResponseToUser = (objRes, next) => {
    next(objRes);
};
exports.SendResponseToUser = SendResponseToUser;
