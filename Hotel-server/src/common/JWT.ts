import { SecrtKey } from '../env';
import { Crypt } from './Crypt';
import { ProjectResponse, errorPath } from './Response';
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken';


// const privateKey = fs.readFileSync(path.join(__dirname, 'private_key.pem'), 'utf8');
// const publicKey = fs.readFileSync(path.join(__dirname, 'public_key.pem'), 'utf8');
const JWT_KEY = 'jbut*%$%^JHFR^$^$^&FC64';
export class Jwt {
    static SignJwt = (data: any, expireIn?: string | number): ProjectResponse => {
        let _res = new ProjectResponse();

        try {
            const objEncrypt = Crypt.Encryption(data);

            if (objEncrypt.error === '') {
                const getToken = jwt.sign(
                    {
                        data: objEncrypt.data,
                    },
                    JWT_KEY!,
                    {
                        expiresIn: expireIn || '1h',
                        //  algorithm: 'RS256' 
                    }
                );

                if (getToken) {
                    _res.data = getToken
                } else {
                    _res.error = 'Server Error not able to generate token'
                }
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
