import { NextFunction, Request, Response } from 'express';
import { ProjectResponse, errorPath } from './Response';
import { SecrtKey } from 'src/env';
import { Convert } from './Convert';
import { Crypt } from './Crypt';

export class Storage {
    static setCookie(key: string, value: string, res: Response, next?: NextFunction): ProjectResponse {
        let _res = new ProjectResponse();
        try {
            const encryptedObj = Crypt.Encryption(value);

            if (encryptedObj.error === '') {
                const isSetCookie = res.cookie(key, encryptedObj.data, {
                    httpOnly: true,
                    secure: SecrtKey.Environment === 'production',
                    sameSite: 'strict',
                    maxAge: 24 * 60 * 60 * 1000, // Cookie expires after 1 day,
                });
                if (!isSetCookie) {
                    _res.error = 'Server Error: Not able to set Cookie.';
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

    static getCookie(key: string, req: Request, next?: NextFunction): ProjectResponse {

        let _res = new ProjectResponse();
        try {

            const cookieValue = req.cookies[key]

            if (cookieValue) {

                const parsedValueObj = Crypt.Decryption(cookieValue)

                if (parsedValueObj.error = '') {
                    _res.data = parsedValueObj.data
                } else {
                    _res.error = errorPath('common/storage', 'getCookie', 47) + parsedValueObj.error
                }

            } else {
                _res.error = 'Server Error: Cookie Not Found.'
            }

        } catch (error) {
            _res.error = errorPath('common/storage', 'getCookie', 55) + error
        } finally {
            return _res;
        }
    }

    static setHeader(key: string, value: string, res: Response, next?: NextFunction): ProjectResponse {
        let _res = new ProjectResponse();

        try {

            const encryptedObj = Crypt.Encryption(value);

            if (encryptedObj.error !== '') {

            } else {
                _res.error = errorPath('common/storage', 'setHeader', 71) + encryptedObj.error
            }

            // const hed = res.setHeader()

        } catch (error) {

        } finally {
            return _res
        }
    }
}
