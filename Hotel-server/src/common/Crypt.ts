import Cryptr from 'cryptr';
import { SecrtKey } from 'src/env';
import { Convert } from './Convert';
import { ProjectResponse } from './Response';

export class Crypt {
    private Key: string = SecrtKey.ENCRYPTION_KEY;

    Encryption(value: any): ProjectResponse {
        let _res: ProjectResponse = new ProjectResponse();

        try {
            const StringData = Convert.toString(value);

            if (StringData.error !== '') {
                const _cryptr = new Cryptr(this.Key, {
                    saltLength: 10,
                    encoding: 'base64',
                    pbkdf2Iterations: 20,
                });

                const EncryptedData: string = _cryptr.encrypt(StringData.data);

                if (EncryptedData) {
                    _res.data = EncryptedData;
                } else {
                    _res.error = 'Server Error: Not able to encrypt data';
                }


            } else {
                _res.error = StringData.error;
            }
        } catch (error: any) {
            _res.error = error;
        } finally {
            return _res;
        }
    }

    Decryption(encryptedValue: string): ProjectResponse {
        let _res: ProjectResponse = new ProjectResponse();

        try {
            const _cryptr = new Cryptr(this.Key);

            const DecryptedData: any = _cryptr.decrypt(encryptedValue);

            if (DecryptedData) {
                _res.data = DecryptedData;
            } else {
                _res.error = 'Server Error: Not able to decrypt data';
            }
        } catch (error: any) {
            _res.error = error;
        } finally {
            return _res;
        }
    }
}
