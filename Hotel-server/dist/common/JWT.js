"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jwt = void 0;
const env_1 = require("src/env");
const Crypt_1 = require("./Crypt");
const Response_1 = require("./Response");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_KEY = env_1.SecrtKey.JWT_KEY;
class Jwt {
}
exports.Jwt = Jwt;
Jwt.SignJwt = (data, expireIn) => {
    let _res = new Response_1.ProjectResponse();
    try {
        const objEncrypt = Crypt_1.Crypt.Encryption(data);
        if (objEncrypt.error === '') {
            jsonwebtoken_1.default.sign({
                data: objEncrypt.data,
            }, JWT_KEY, { expiresIn: expireIn || '1h', algorithm: 'RS256' }, (error, token) => {
                if (error) {
                    _res.error = (0, Response_1.errorPath)('common/JWT', 'SignJwt', 22) + error;
                }
                if (token !== undefined) {
                    _res.data = token;
                }
                else {
                    _res.error = (0, Response_1.errorPath)('common/JWT', 'SignJwt', 27) + 'While Sign in JWT Getting token undefine';
                }
            });
        }
        else {
            _res.error = (0, Response_1.errorPath)('common/JWT', 'SignJwt', 32) + objEncrypt.error;
        }
    }
    catch (error) {
        _res.error = (0, Response_1.errorPath)('common/JWT', 'SignJwt', 35) + error;
    }
    finally {
        return _res;
    }
};
Jwt.VerifyJwt = (token, key) => {
    let _res = new Response_1.ProjectResponse();
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, key !== undefined ? key : JWT_KEY);
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
            _res.error = (0, Response_1.errorPath)('common/JWT', 'VerifyJwt', 57) + 'Not able to Decode Token, Might bo Wrong Key Provided.';
        }
    }
    catch (error) {
        _res.error = (0, Response_1.errorPath)('common/JWT', 'VerifyJwt', 60) + error;
    }
    finally {
        return _res;
    }
};
