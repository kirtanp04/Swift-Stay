import { Request, Response } from 'express';
import { SecrtKey } from 'src/env';
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
                _res.error = errorPath('common/storage', 'setCookie', 24) + encryptedObj.error;
            }
        } catch (err) {
            _res.error = errorPath('common/storage', 'setCookie', 27) + err;
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
                    _res.error = errorPath('common/storage', 'getCookie', 47) + decryptedValueObj.error;
                }
            } else {
                _res.error = 'Server Error: Cookie Not Found.';
            }
        } catch (error) {
            _res.error = errorPath('common/storage', 'getCookie', 55) + error;
        } finally {
            return _res;
        }
    }

    static clereCookie(key: string, res: Response): ProjectResponse {
        let _res = new ProjectResponse();
        try {

            const isCleared = res.clearCookie(key)
            if (isCleared) {
                _res.data = 'Success: Cleared Cookie'
            } else {
                errorPath('common/storage', 'clereCookie', 66) + 'Not able clear Cookie, Might Wrong Key';
            }

        } catch (error) {
            _res.error = errorPath('common/storage', 'clereCookie', 70) + error;
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
                    _res.error = 'Server Error: Header Not Set.';
                } else {
                    _res.data = 'Success: Header Set';
                }
            } else {
                _res.error = errorPath('common/storage', 'setHeader', 91) + encryptedObj.error;
            }
        } catch (error) {
            _res.error = errorPath('common/storage', 'setHeader', 95) + error;
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
                    _res.error = errorPath('common/storage', 'getHeader', 112) + decryptedValueObj.error;
                }
            } else {
                _res.error = errorPath('common/storage', 'getHeader', 115) + 'Header Not Found.';
            }
        } catch (error) {
            _res.error = errorPath('common/storage', 'getHeader', 118) + error;
        } finally {
            return _res;
        }
    }
}
