"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
const env_1 = require("../env");
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
                _res.error = (0, Response_1.errorPath)('common/storage', 'setCookie', 26) + encryptedObj.error;
            }
        }
        catch (err) {
            _res.error = (0, Response_1.errorPath)('common/storage', 'setCookie', 29) + err;
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
                    _res.error = (0, Response_1.errorPath)('common/storage', 'getCookie', 46) + decryptedValueObj.error;
                }
            }
            else {
                _res.error = (0, Response_1.errorPath)('common/storage', 'getCookie', 49) + 'Cookie Not Found.';
            }
        }
        catch (error) {
            _res.error = (0, Response_1.errorPath)('common/storage', 'getCookie', 52) + error;
        }
        finally {
            return _res;
        }
    }
    static clereCookie(key, res, req) {
        let _res = new Response_1.ProjectResponse();
        try {
            const _cookieObj = this.getCookie(key, req);
            if (_cookieObj.error === '') {
                const isCleared = res.clearCookie(key);
                if (isCleared) {
                    _res.data = 'Success: Cleared Cookie';
                }
                else {
                    _res.error = (0, Response_1.errorPath)('common/storage', 'clereCookie', 68) + 'Not able clear Cookie, Might Wrong Key';
                }
            }
            else {
                _res.error = (0, Response_1.errorPath)('common/storage', 'clereCookie', 71) + _cookieObj.error;
            }
        }
        catch (error) {
            _res.error = (0, Response_1.errorPath)('common/storage', 'clereCookie', 74) + error;
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
                    _res.error = (0, Response_1.errorPath)('common/storage', 'setHeader', 90) + ' Header Not Set.';
                }
                else {
                    _res.data = 'Success: Header Set';
                }
            }
            else {
                _res.error = (0, Response_1.errorPath)('common/storage', 'setHeader', 95) + encryptedObj.error;
            }
        }
        catch (error) {
            _res.error = (0, Response_1.errorPath)('common/storage', 'setHeader', 98) + error;
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
                    _res.error = (0, Response_1.errorPath)('common/storage', 'getHeader', 116) + decryptedValueObj.error;
                }
            }
            else {
                _res.error = (0, Response_1.errorPath)('common/storage', 'getHeader', 119) + 'Header Not Found.';
            }
        }
        catch (error) {
            _res.error = (0, Response_1.errorPath)('common/storage', 'getHeader', 122) + error;
        }
        finally {
            return _res;
        }
    }
}
exports.Storage = Storage;
