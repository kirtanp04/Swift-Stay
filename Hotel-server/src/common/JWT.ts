import { SecrtKey } from '../env';
import { Crypt } from './Crypt';
import { ProjectResponse, errorPath } from './Response';
import jwt from 'jsonwebtoken';

const JWT_KEY = SecrtKey.JWT_KEY;
export class Jwt {
    static SignJwt = (data: any, expireIn?: string | number): ProjectResponse => {
        let _res = new ProjectResponse();

        try {
            const objEncrypt = Crypt.Encryption(data);

            if (objEncrypt.error === '') {
                jwt.sign(
                    {
                        data: objEncrypt.data,
                    },
                    JWT_KEY!,
                    { expiresIn: expireIn || '1h', algorithm: 'RS256' },
                    (error, token) => {
                        if (error) {
                            _res.error = errorPath('common/JWT', 'SignJwt', 23) + error;
                        }
                        if (token !== undefined) {
                            _res.data = token;
                        } else {
                            _res.error = errorPath('common/JWT', 'SignJwt', 28) + 'While Sign in JWT Getting token undefine';
                        }
                    }
                );
            } else {
                _res.error = errorPath('common/JWT', 'SignJwt', 33) + objEncrypt.error;
            }
        } catch (error) {
            _res.error = errorPath('common/JWT', 'SignJwt', 36) + error;
        } finally {
            return _res;
        }
    };



    static VerifyJwt = (token: string): ProjectResponse => {
        let _res = new ProjectResponse();

        try {
            const decodedToken: any = jwt.verify(token, JWT_KEY!);
            if (decodedToken) {
                const objDecrypt = Crypt.Decryption(decodedToken.data)

                if (objDecrypt.error === '') {
                    _res.data = objDecrypt.data
                } else {
                    _res.error = errorPath('common/JWT', 'VerifyJwt', 54) + objDecrypt.error;
                }
            } else {
                _res.error = errorPath('common/JWT', 'VerifyJwt', 57) + 'Not able to Decode Token, Might bo Wrong Token/key Provided.';
            }
        } catch (error) {
            _res.error = errorPath('common/JWT', 'VerifyJwt', 60) + error;
        } finally {
            return _res;
        }
    };
}
