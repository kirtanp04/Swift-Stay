import Cryptr from 'cryptr';
import bcrypt from 'bcrypt'
import { SecrtKey } from '../env';
import { Convert } from './Convert';
import { ProjectResponse, errorPath } from './Response';

export class Crypt {

    private static _cryptr = new Cryptr(SecrtKey.ENCRYPTION_KEY!, {
        saltLength: 10,
        encoding: 'base64',
    });


    static Encryption(value: any): ProjectResponse {

        let _res: ProjectResponse = new ProjectResponse();

        try {
            let StringData: ProjectResponse = new ProjectResponse()
            if (isTypeString(value)) {

                StringData.data = value

            } else {
                StringData = Convert.toString(value);
            }

            if (StringData.error === '') {


                const EncryptedData: string = this._cryptr.encrypt(StringData.data);

                if (EncryptedData) {
                    _res.data = EncryptedData;
                } else {
                    _res.error = 'Server Error: Not able to encrypt data';
                }


            } else {
                _res.error = errorPath('common/Crypt', 'Encryption', 32) + StringData.error;
            }
        } catch (error: any) {
            _res.error = errorPath('common/Crypt', 'Encryption', 35) + error;
        } finally {
            return _res;
        }
    }

    static Decryption(encryptedValue: string): ProjectResponse {
        let _res: ProjectResponse = new ProjectResponse();

        try {
            const DecryptedData: any = this._cryptr.decrypt(encryptedValue);

            if (DecryptedData) {

                const parseObj = Convert.toParse(DecryptedData)

                if (parseObj.error === '') {

                    _res.data = parseObj.data;

                } else {

                    _res.error = errorPath('common/Crypt', 'Decryption', 56) + parseObj.error
                }


            } else {
                _res.error = 'Server Error: Not able to decrypt data';
            }
        } catch (error: any) {
            _res.error = errorPath('common/Crypt', 'Decryption', 55) + error;
        } finally {
            return _res;
        }
    }

    static async hashValue(value: any): Promise<ProjectResponse> {

        let _res: ProjectResponse = new ProjectResponse();

        try {
            // let StringData: ProjectResponse = new ProjectResponse()
            // if (isTypeString(value)) {

            //     StringData.data = value

            // } else {
            //     StringData = Convert.toString(value);
            // }

            // if (StringData.error === '') {

            await bcrypt.hash(value, 10, (err, hash) => {
                if (err) {
                    _res.error = errorPath('common/Crypt', 'hashValue', 99) + err
                } else {
                    _res.data = hash
                }
            })


            // } else {
            //     _res.error = errorPath('common/Crypt', 'hashValue', 107) + StringData.error;
            // }
        } catch (error: any) {
            _res.error = errorPath('common/Crypt', 'hashValue', 110) + error;
        } finally {
            return _res;
        }
    }

    static async compareHash(hashValue: string, originalValue: any): Promise<ProjectResponse> {

        let _res: ProjectResponse = new ProjectResponse();

        try {


            await bcrypt.compare(originalValue, hashValue, (err, hash) => {
                if (err) {
                    _res.error = errorPath('common/Crypt', 'compareHash', 134) + err
                } else {
                    _res.data = 'Success: compare HashValue'
                }
            })



        } catch (error: any) {
            _res.error = errorPath('common/Crypt', 'compareHash', 145) + error;
        } finally {
            return _res;
        }
    }
}





export function isTypeString(value: unknown): boolean {

    if (typeof value === 'string') {
        return true
    } else {
        return false
    }

}