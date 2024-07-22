import { Crypt } from "./Crypt";
import { ProjectResponse } from "./Response";

export class Storage {
    static setTolocalStorage = (key: string, data: any): ProjectResponse => {
        let _res = new ProjectResponse();
        try {
            const objEncrypt = Crypt.Encryption(data);

            if (objEncrypt.error === "") {
                localStorage.setItem(key, objEncrypt.data);

                _res.data = "Success: set to local storage";
            } else {
                _res.error = objEncrypt.error;
            }
        } catch (error: any) {
            _res.error = error;
        } finally {
            return _res;
        }
    };

    static setToSessionStorage = (key: string, data: any): ProjectResponse => {
        let _res = new ProjectResponse();
        try {
            const objEncrypt = Crypt.Encryption(data);

            if (objEncrypt.error === "") {
                sessionStorage.setItem(key, objEncrypt.data);

                _res.data = "Success: set to Session storage";
            } else {
                _res.error = objEncrypt.error;
            }
        } catch (error: any) {
            _res.error = error;
        } finally {
            return _res;
        }
    };

    static getFromlocalStorage = (key: string): ProjectResponse => {
        let _res = new ProjectResponse();
        try {
            const decryptData = localStorage.getItem(key);

            if (decryptData) {
                const objDecrypt = Crypt.Decryption(decryptData);

                if (objDecrypt.error === "") {
                    _res.data = objDecrypt.data;
                } else {
                    _res.error = objDecrypt.error;
                }
            } else {
                _res.error = "Data is not available. Might wrong key provided";
            }
        } catch (error: any) {
            _res.error = error;
        } finally {
            return _res;
        }
    };

    static getFromSessionStorage = (key: string): ProjectResponse => {
        let _res = new ProjectResponse();
        try {
            const decryptData = sessionStorage.getItem(key);

            if (decryptData) {
                const objDecrypt = Crypt.Decryption(decryptData);

                if (objDecrypt.error === "") {
                    _res.data = objDecrypt.data;
                } else {
                    _res.error = objDecrypt.error;
                }
            } else {
                _res.error = "Data is not available. Might wrong key provided";
            }
        } catch (error: any) {
            _res.error = error;
        } finally {
            return _res;
        }
    };
}
