"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crypt = void 0;
const cryptr_1 = __importDefault(require("cryptr"));
const env_1 = require("../env");
const Convert_1 = require("./Convert");
const Response_1 = require("./Response");
class Crypt {
    static Encryption(value) {
        let _res = new Response_1.ProjectResponse();
        try {
            const StringData = Convert_1.Convert.toString(value);
            if (StringData.error !== '') {
                const _cryptr = new cryptr_1.default(env_1.SecrtKey.ENCRYPTION_KEY, {
                    saltLength: 10,
                    encoding: 'base64',
                    pbkdf2Iterations: 20,
                });
                const EncryptedData = _cryptr.encrypt(StringData.data);
                if (EncryptedData) {
                    _res.data = EncryptedData;
                }
                else {
                    _res.error = 'Server Error: Not able to encrypt data';
                }
            }
            else {
                _res.error = (0, Response_1.errorPath)('common/Crypt', 'Encryption', 32) + StringData.error;
            }
        }
        catch (error) {
            _res.error = (0, Response_1.errorPath)('common/Crypt', 'Encryption', 35) + error;
        }
        finally {
            return _res;
        }
    }
    static Decryption(encryptedValue) {
        let _res = new Response_1.ProjectResponse();
        try {
            const _cryptr = new cryptr_1.default(env_1.SecrtKey.ENCRYPTION_KEY);
            const DecryptedData = _cryptr.decrypt(encryptedValue);
            if (DecryptedData) {
                const parseObj = Convert_1.Convert.toParse(DecryptedData);
                if (parseObj.error === '') {
                    _res.data = parseObj.data;
                }
                else {
                    _res.error = (0, Response_1.errorPath)('common/Crypt', 'Decryption', 56) + parseObj.error;
                }
            }
            else {
                _res.error = 'Server Error: Not able to decrypt data';
            }
        }
        catch (error) {
            _res.error = (0, Response_1.errorPath)('common/Crypt', 'Decryption', 55) + error;
        }
        finally {
            return _res;
        }
    }
}
exports.Crypt = Crypt;
