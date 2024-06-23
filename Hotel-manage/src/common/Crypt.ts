import * as CryptoTS from "crypto-ts";
import { ProjectResponse } from "./Response";
import { Convert } from "./Convert";
// import { logEntry } from 'src/logging/logger';

export class Crypt {
    private static key = CryptoTS.enc.Utf8.parse(
        "knjbvuigbuvhuy84578953686578ty78"
    );

    private static Iv = CryptoTS.enc.Utf8.parse(
        "knjbvuigbuvhuy84578953686578ty78"
    );

    static Decryption(value: string): ProjectResponse {
        let _res = new ProjectResponse();
        try {
            debugger
            const encryptedString = atob(value);

            const decrypted = CryptoTS.AES.decrypt(encryptedString, Crypt.key, {
                iv: Crypt.Iv,
                mode: CryptoTS.mode.CBC,
                padding: CryptoTS.pad.PKCS7,
            });

            const decryptedData = decrypted.toString(CryptoTS.enc.Utf8);
            if (decryptedData) {
                const parseObj = Convert.toParse(decryptedData);
                if (parseObj.error === "") {
                    _res.data = parseObj.data;
                } else {
                    _res.error = parseObj.error;
                }
            } else {
                _res.error = "Not able to decrypt the data";
            }
        } catch (error: any) {
            _res.error = error.message;
        } finally {
            return _res;
        }
    }


    static Encryption(value: any): ProjectResponse {
        let _res = new ProjectResponse();
        try {
            const objString = Convert.toString(value);

            if (objString.error === "") {
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
                    _res.error = "Not able to encrypt the data";
                }
            } else {
                _res.error = objString.error;
            }
        } catch (error: any) {
            _res.error = error.message;
        } finally {
            return _res;
        }
    }

}
