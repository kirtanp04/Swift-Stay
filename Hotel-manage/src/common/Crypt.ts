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

// import * as CryptoTS from 'crypto-ts';
// import { logEntry } from 'src/logging/logger';

// export class RSAService {
//   private static key = CryptoTS.enc.Utf8.parse('!@#$%^sFxH&+58~A');

//   private static Iv = CryptoTS.enc.Utf8.parse('!@#$%^sFxH&+58~A');

//   /**
//    *
//    * @param value string value
//    * @returns
//    */
//   static Encryption(value: string): string {
//     try {
//       const utf8String = CryptoTS.enc.Utf8.parse(value);
//       return CryptoTS.AES.encrypt(utf8String, RSAService.key, {
//         iv: RSAService.Iv,
//         mode: CryptoTS.mode.CBC,
//         padding: CryptoTS.pad.PKCS7
//       }) as unknown as string;  
//     } catch (error) {
//       logEntry("RSAService - Encryption","Caught in exception "+error);
//       return "";
//     }
    
//   }

//   /**
//    *
//    * @param value
//    * @returns
//    */
//   static Decryption(value: string): string {
//     try {

//       const bytes = CryptoTS.AES.decrypt(value.toString(), RSAService.key, {
//         iv: RSAService.Iv,
//         mode: CryptoTS.mode.CBC,
//         padding: CryptoTS.pad.PKCS7
//       });
  
//       return bytes.toString(CryptoTS.enc.Utf8);
  
//     } catch (error) {

//       logEntry("RSAService - Decryption","Caught in exception "+error);
//       return "";

//     }

//   }

//   /**
//    *
//    * @param value
//    * @returns
//    */
//   static EncryptionToBas64(value: string): string {
//     try {
//       const utf8String = CryptoTS.enc.Utf8.parse(value);
//     let encryptredString: string = '';

//     encryptredString = CryptoTS.AES.encrypt(utf8String, RSAService.key, {
//       iv: RSAService.Iv,
//       mode: CryptoTS.mode.CBC,
//       padding: CryptoTS.pad.PKCS7
//     }) as unknown as string;

//     return btoa(encryptredString);
//     } catch (error) {
//       logEntry("RSAService - EncryptionToBas64","Caught in exception "+error);
//       return "";
//     }
    
//   }
// }
