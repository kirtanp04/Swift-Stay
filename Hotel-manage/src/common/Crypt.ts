import Cryptr from "cryptr";
import { Convert } from "./Convert";
import { ProjectResponse } from "./Response";

export class Crypt {
    private static _cryptr = new Cryptr("knjbvuigbuvhuy84578953686578ty78", {
        saltLength: 10,
        encoding: "base64",
    });

    static Encryption(value: any): ProjectResponse {
        let _res: ProjectResponse = new ProjectResponse();

        try {
            debugger
            const StringData = Convert.toString(value);

            if (StringData.error === "") {
                const _CR = new Cryptr("knjbvuigbuvhuy84578953686578ty78", {
                    saltLength: 10,
                    encoding: "base64",
                });
                const EncryptedData = _CR.encrypt(StringData.data);

                if (EncryptedData) {
                    _res.data = EncryptedData;
                } else {
                    _res.error = "Not able to encrypt data";
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

    static Decryption(encryptedValue: string): ProjectResponse {
        let _res: ProjectResponse = new ProjectResponse();

        try {
            const DecryptedData: any = this._cryptr.decrypt(encryptedValue);

            if (DecryptedData) {
                const parseObj = Convert.toParse(DecryptedData);

                if (parseObj.error === "") {
                    _res.data = parseObj.data;
                } else {
                    _res.error = parseObj.error;
                }
            } else {
                _res.error = "Not able to decrypt data";
            }
        } catch (error: any) {
            _res.error = error;
        } finally {
            return _res;
        }
    }
}

