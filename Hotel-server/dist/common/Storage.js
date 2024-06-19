"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
const env_1 = require("src/env");
const Crypt_1 = require("./Crypt");
const Response_1 = require("./Response");
class Storage {
    static setCookie(key, value, res, cookiePath, maxAge) {
        let _res = new Response_1.ProjectResponse();
        try {
            const encryptedObj = Crypt_1.Crypt.Encryption(value);
            if (encryptedObj.error === '') {
                const isSetCookie = res.cookie(key, encryptedObj.data, {
                    httpOnly: true,
                    secure: env_1.SecrtKey.Environment === 'production',
                    sameSite: 'strict',
                    maxAge: maxAge !== undefined ? maxAge : 24 * 60 * 60 * 1000, // default Cookie expires after 1 day,
                    path: cookiePath !== undefined ? cookiePath : '/',
                });
                if (!isSetCookie) {
                    _res.error = 'Server Error: Not able to set Cookie.';
                }
                else {
                    _res.data = 'Success: Cookie Set';
                }
            }
            else {
                _res.error = (0, Response_1.errorPath)('common/storage', 'setCookie', 24) + encryptedObj.error;
            }
        }
        catch (err) {
            _res.error = (0, Response_1.errorPath)('common/storage', 'setCookie', 27) + err;
        }
        finally {
            return _res;
        }
    }
    static getCookie(key, req) {
        let _res = new Response_1.ProjectResponse();
        try {
            const cookieValue = req.cookies[key];
            if (cookieValue) {
                const decryptedValueObj = Crypt_1.Crypt.Decryption(cookieValue);
                if ((decryptedValueObj.error = '')) {
                    _res.data = decryptedValueObj.data;
                }
                else {
                    _res.error = (0, Response_1.errorPath)('common/storage', 'getCookie', 47) + decryptedValueObj.error;
                }
            }
            else {
                _res.error = 'Server Error: Cookie Not Found.';
            }
        }
        catch (error) {
            _res.error = (0, Response_1.errorPath)('common/storage', 'getCookie', 55) + error;
        }
        finally {
            return _res;
        }
    }
    static clereCookie(key, res) {
        let _res = new Response_1.ProjectResponse();
        try {
            const isCleared = res.clearCookie(key);
            if (isCleared) {
                _res.data = 'Success: Cleared Cookie';
            }
            else {
                (0, Response_1.errorPath)('common/storage', 'clereCookie', 55) + 'Not able clear Cookie, Might Wrong Key';
            }
        }
        catch (error) {
            _res.error = (0, Response_1.errorPath)('common/storage', 'clereCookie', 55) + error;
        }
        finally {
            return _res;
        }
    }
    static setHeader(key, value, res) {
        let _res = new Response_1.ProjectResponse();
        try {
            const encryptedObj = Crypt_1.Crypt.Encryption(value);
            if (encryptedObj.error !== '') {
                const settingHeader = res.setHeader(key, encryptedObj.data);
                if (!settingHeader) {
                    _res.error = 'Server Error: Header Not Set.';
                }
                else {
                    _res.data = 'Success: Header Set';
                }
            }
            else {
                _res.error = (0, Response_1.errorPath)('common/storage', 'setHeader', 81) + encryptedObj.error;
            }
        }
        catch (error) {
            _res.error = (0, Response_1.errorPath)('common/storage', 'setHeader', 85) + error;
        }
        finally {
            return _res;
        }
    }
    static getHeader(key, req) {
        let _res = new Response_1.ProjectResponse();
        try {
            const headerValue = req.header(key);
            if (headerValue) {
                const decryptedValueObj = Crypt_1.Crypt.Decryption(headerValue);
                if (decryptedValueObj.error === '') {
                    _res.data = decryptedValueObj.data;
                }
                else {
                    _res.error = (0, Response_1.errorPath)('common/storage', 'getHeader', 105) + decryptedValueObj.error;
                }
            }
            else {
                _res.error = 'Server Error: Header Not Found.';
            }
        }
        catch (error) {
            _res.error = (0, Response_1.errorPath)('common/storage', 'getHeader', 99) + error;
        }
        finally {
            return _res;
        }
    }
}
exports.Storage = Storage;
