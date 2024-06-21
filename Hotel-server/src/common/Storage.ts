import { Request, Response } from 'express';
import { SecrtKey } from '../env';
import { Crypt } from './Crypt';
import { ProjectResponse, errorPath } from './Response';

export class Storage {
    static setCookie(key: string, value: string, res: Response, cookiePath?: string, maxAge?: number): ProjectResponse {
        let _res = new ProjectResponse();
        try {
            const encryptedObj = Crypt.Encryption(value);

            if (encryptedObj.error === '') {
                const isSetCookie = res.cookie(key, encryptedObj.data, {
                    httpOnly: true,
                    secure: SecrtKey.Environment === 'production',
                    sameSite: 'strict',
                    maxAge: maxAge !== undefined ? maxAge : 24 * 60 * 60 * 1000, // default Cookie expires after 1 day,
                    path: cookiePath !== undefined ? cookiePath : '/',
                });
                if (!isSetCookie) {
                    _res.error = 'Server Error: Not able to set Cookie.';
                } else {
                    _res.data = 'Success: Cookie Set';
                }
            } else {
                _res.error = errorPath('common/storage', 'setCookie', 26) + encryptedObj.error;
            }
        } catch (err) {
            _res.error = errorPath('common/storage', 'setCookie', 29) + err;
        } finally {
            return _res;
        }
    }

    static getCookie(key: string, req: Request): ProjectResponse {
        let _res = new ProjectResponse();
        try {
            const cookieValue = req.cookies[key];

            if (cookieValue) {
                const decryptedValueObj = Crypt.Decryption(cookieValue);

                if ((decryptedValueObj.error = '')) {
                    _res.data = decryptedValueObj.data;
                } else {
                    _res.error = errorPath('common/storage', 'getCookie', 46) + decryptedValueObj.error;
                }
            } else {
                _res.error = errorPath('common/storage', 'getCookie', 49) + 'Cookie Not Found.';
            }
        } catch (error) {
            _res.error = errorPath('common/storage', 'getCookie', 52) + error;
        } finally {
            return _res;
        }
    }

    static clereCookie(key: string, res: Response, req: Request): ProjectResponse {
        let _res = new ProjectResponse();
        try {
            const _cookieObj = this.getCookie(key, req);

            if (_cookieObj.error === '') {
                const isCleared = res.clearCookie(key);
                if (isCleared) {
                    _res.data = 'Success: Cleared Cookie';
                } else {
                    _res.error = errorPath('common/storage', 'clereCookie', 68) + 'Not able clear Cookie, Might Wrong Key';
                }
            } else {
                _res.error = errorPath('common/storage', 'clereCookie', 71) + _cookieObj.error;
            }
        } catch (error) {
            _res.error = errorPath('common/storage', 'clereCookie', 74) + error;
        } finally {
            return _res;
        }
    }

    static setHeader(key: string, value: string, res: Response): ProjectResponse {
        let _res = new ProjectResponse();

        try {
            const encryptedObj = Crypt.Encryption(value);

            if (encryptedObj.error !== '') {
                const settingHeader = res.setHeader(key, encryptedObj.data);

                if (!settingHeader) {
                    _res.error = errorPath('common/storage', 'setHeader', 90) + ' Header Not Set.';
                } else {
                    _res.data = 'Success: Header Set';
                }
            } else {
                _res.error = errorPath('common/storage', 'setHeader', 95) + encryptedObj.error;
            }
        } catch (error) {
            _res.error = errorPath('common/storage', 'setHeader', 98) + error;
        } finally {
            return _res;
        }
    }

    static getHeader(key: string, req: Request): ProjectResponse {
        let _res = new ProjectResponse();

        try {
            const headerValue = req.header(key);

            if (headerValue) {
                const decryptedValueObj = Crypt.Decryption(headerValue);

                if (decryptedValueObj.error === '') {
                    _res.data = decryptedValueObj.data;
                } else {
                    _res.error = errorPath('common/storage', 'getHeader', 116) + decryptedValueObj.error;
                }
            } else {
                _res.error = errorPath('common/storage', 'getHeader', 119) + 'Header Not Found.';
            }
        } catch (error) {
            _res.error = errorPath('common/storage', 'getHeader', 122) + error;
        } finally {
            return _res;
        }
    }
}
