import Cryptr from 'cryptr';
import bcrypt from 'bcrypt';
import { SecrtKey } from '../env';

import * as CryptoTS from 'crypto-ts';
import { ProjectResponse, errorPath } from './Response';
import { Convert } from './Convert';
// import { logEntry } from 'src/logging/logger';

export class Crypt {
    private static key = CryptoTS.enc.Utf8.parse('knjbvuigbuvhuy84578953686578ty78');

    private static Iv = CryptoTS.enc.Utf8.parse('knjbvuigbuvhuy84578953686578ty78');

    static Decryption(value: string): ProjectResponse {
        let _res = new ProjectResponse();
        try {
            const encryptedString = atob(value);

            const decrypted = CryptoTS.AES.decrypt(encryptedString, Crypt.key, {
                iv: Crypt.Iv,
                mode: CryptoTS.mode.CBC,
                padding: CryptoTS.pad.PKCS7,
            });

            const decryptedData = decrypted.toString(CryptoTS.enc.Utf8);
            if (decryptedData) {
                const parseObj = Convert.toParse(decryptedData);
                if (parseObj.error === '') {
                    _res.data = parseObj.data;
                } else {
                    _res.error = parseObj.error;
                }
            } else {
                _res.error = errorPath('common/Crypt', 'Decryption', 35) + 'Not able to decrypt the data';
            }
        } catch (error: any) {
            _res.error = errorPath('common/Crypt', 'Decryption', 38) + error.message;
        } finally {
            return _res;
        }
    }

    static Encryption(value: any): ProjectResponse {
        let _res = new ProjectResponse();
        try {
            const objString = Convert.toString(value);

            if (objString.error === '') {
                const utf8String = CryptoTS.enc.Utf8.parse(objString.data);

                const encrypted = CryptoTS.AES.encrypt(utf8String, Crypt.key, {
                    iv: Crypt.Iv,
                    mode: CryptoTS.mode.CBC,
                    padding: CryptoTS.pad.PKCS7,
                });

                const encryptedData = btoa(encrypted.toString());
                if (encryptedData) {
                    _res.data = encryptedData;
                } else {
                    _res.error = errorPath('common/Crypt', 'Decryption', 62) + 'Not able to encrypt the data';
                }
            } else {
                _res.error = objString.error;
            }
        } catch (error: any) {
            _res.error = errorPath('common/Crypt', 'Decryption', 68) + error.message;
        } finally {
            return _res;
        }
    }

    static async hashValue(value: any): Promise<ProjectResponse> {
        let _res: ProjectResponse = new ProjectResponse();

        try {
            const hashData = await bcrypt.hash(value, 10);

            if (hashData) {
                _res.data = hashData;
            } else {
                _res.error = errorPath('common/Crypt', 'hashValue', 83) + 'Not able to hash data';
            }
        } catch (error: any) {
            _res.error = errorPath('common/Crypt', 'hashValue', 86) + error;
        } finally {
            return _res;
        }
    }

    static async compareHash(hashValue: string, originalValue: any): Promise<ProjectResponse> {
        let _res: ProjectResponse = new ProjectResponse();

        try {
            const isSuccess = await bcrypt.compare(originalValue, hashValue);

            if (isSuccess) {
                _res.data = isSuccess;
            } else {
                _res.error = errorPath('common/Crypt', 'compareHash', 101) + 'Hash value did not match';
            }
        } catch (error: any) {
            _res.error = errorPath('common/Crypt', 'compareHash', 104) + error;
        } finally {
            return _res;
        }
    }
}

export function isTypeString(value: unknown): boolean {
    if (typeof value === 'string') {
        return true;
    } else {
        return false;
    }
}
