"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../env");
const Crypt_1 = require("./Crypt");
const Response_1 = require("./Response");
class Jwt {
}
exports.Jwt = Jwt;
_a = Jwt;
Jwt.JWT_KEY = env_1.SecrtKey.JWT_KEY;
Jwt.SignJwt = (data, expireIn) => {
    let _res = new Response_1.ProjectResponse();
    try {
        const objEncrypt = Crypt_1.Crypt.Encryption(data);
        if (objEncrypt.error === '') {
            const getToken = jsonwebtoken_1.default.sign({
                data: objEncrypt.data,
            }, _a.JWT_KEY, {
                expiresIn: expireIn || '1h',
                //  algorithm: 'RS256'
            });
            if (getToken) {
                _res.data = getToken;
            }
            else {
                _res.error = 'Server Error not able to generate token';
            }
        }
        else {
            _res.error = (0, Response_1.errorPath)('common/JWT', 'SignJwt', 33) + objEncrypt.error;
        }
    }
    catch (error) {
        _res.error = (0, Response_1.errorPath)('common/JWT', 'SignJwt', 36) + error;
    }
    finally {
        return _res;
    }
};
Jwt.VerifyJwt = (token) => {
    let _res = new Response_1.ProjectResponse();
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, _a.JWT_KEY);
        if (decodedToken) {
            const objDecrypt = Crypt_1.Crypt.Decryption(decodedToken.data);
            if (objDecrypt.error === '') {
                _res.data = objDecrypt.data;
            }
            else {
                _res.error = (0, Response_1.errorPath)('common/JWT', 'VerifyJwt', 54) + objDecrypt.error;
            }
        }
        else {
            _res.error = (0, Response_1.errorPath)('common/JWT', 'VerifyJwt', 57) + 'Not able to Decode Token, Might bo Wrong Token/key Provided.';
        }
    }
    catch (error) {
        _res.error = (0, Response_1.errorPath)('common/JWT', 'VerifyJwt', 60) + error;
    }
    finally {
        return _res;
    }
};
