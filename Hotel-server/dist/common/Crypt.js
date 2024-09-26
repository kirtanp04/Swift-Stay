"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTypeString = exports.Crypt = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const CryptoTS = __importStar(require("crypto-ts"));
const Convert_1 = require("./Convert");
const Response_1 = require("./Response");
const env_1 = require("../env");
// import { logEntry } from 'src/logging/logger';
class Crypt {
    static Decryption(value) {
        let _res = new Response_1.ProjectResponse();
        try {
            const encryptedString = atob(value);
            const decrypted = CryptoTS.AES.decrypt(encryptedString, Crypt.key, {
                iv: Crypt.Iv,
                mode: CryptoTS.mode.CBC,
                padding: CryptoTS.pad.PKCS7,
            });
            const decryptedData = decrypted.toString(CryptoTS.enc.Utf8);
            if (decryptedData) {
                const parseObj = Convert_1.Convert.toParse(decryptedData);
                if (parseObj.error === '') {
                    _res.data = parseObj.data;
                }
                else {
                    _res.error = parseObj.error;
                }
            }
            else {
                _res.error = (0, Response_1.errorPath)('common/Crypt', 'Decryption', 35) + 'Not able to decrypt the data';
            }
        }
        catch (error) {
            _res.error = (0, Response_1.errorPath)('common/Crypt', 'Decryption', 38) + error.message;
        }
        finally {
            return _res;
        }
    }
    static Encryption(value) {
        let _res = new Response_1.ProjectResponse();
        try {
            const objString = Convert_1.Convert.toString(value);
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
                }
                else {
                    _res.error = (0, Response_1.errorPath)('common/Crypt', 'Decryption', 62) + 'Not able to encrypt the data';
                }
            }
            else {
                _res.error = objString.error;
            }
        }
        catch (error) {
            _res.error = (0, Response_1.errorPath)('common/Crypt', 'Decryption', 68) + error.message;
        }
        finally {
            return _res;
        }
    }
    static hashValue(value) {
        return __awaiter(this, void 0, void 0, function* () {
            let _res = new Response_1.ProjectResponse();
            try {
                const hashData = yield bcrypt_1.default.hash(value, 10);
                if (hashData) {
                    _res.data = hashData;
                }
                else {
                    _res.error = (0, Response_1.errorPath)('common/Crypt', 'hashValue', 83) + 'Not able to hash data';
                }
            }
            catch (error) {
                _res.error = (0, Response_1.errorPath)('common/Crypt', 'hashValue', 86) + error;
            }
            finally {
                return _res;
            }
        });
    }
    static compareHash(hashValue, originalValue) {
        return __awaiter(this, void 0, void 0, function* () {
            let _res = new Response_1.ProjectResponse();
            try {
                const isSuccess = yield bcrypt_1.default.compare(originalValue, hashValue);
                if (isSuccess) {
                    _res.data = isSuccess;
                }
                else {
                    _res.error = (0, Response_1.errorPath)('common/Crypt', 'compareHash', 101) + 'Hash value did not match';
                }
            }
            catch (error) {
                _res.error = (0, Response_1.errorPath)('common/Crypt', 'compareHash', 104) + error;
            }
            finally {
                return _res;
            }
        });
    }
}
exports.Crypt = Crypt;
Crypt.key = CryptoTS.enc.Utf8.parse(env_1.SecrtKey.ENCRYPTION_KEY);
Crypt.Iv = CryptoTS.enc.Utf8.parse(env_1.SecrtKey.ENCRYPTION_KEY);
function isTypeString(value) {
    if (typeof value === 'string') {
        return true;
    }
    else {
        return false;
    }
}
exports.isTypeString = isTypeString;
