import axiosCall from "src/service/axios";
import { Crypt } from "./Crypt";
import { ProjectResponse } from "./Response";

export class TParam {
    Broker: string = "";

    function: string = "";

    data: any;
}

export class Api {
    static async get(_Param: TParam): Promise<ProjectResponse> {
        let _res = new ProjectResponse();
        try {
            const encryptData = Crypt.Encryption(_Param);

            if (encryptData.error === "") {
                const response = await axiosCall.get(encryptData.data, {
                    withCredentials: true
                })
                console.log(response)
            } else {
                _res.error = encryptData.error;
            }
        } catch (error) {
            console.log(error);
            _res.error = error;
        } finally {
            return _res;
        }
    }
    static async post(_Param: TParam, data: any): Promise<ProjectResponse> {
        let _res = new ProjectResponse();

        try {
            const _objEncrypt = _res;
            if (_objEncrypt.error === "") {
                const response = await axiosCall.post(_objEncrypt.data, { data });
                console.log(response);
            } else {
                _res.error = _objEncrypt.error;
            }
        } catch (error) {
            _res.error = error;
        } finally {
            return _res;
        }
    }

    static async protectedGet(_Param: TParam): Promise<ProjectResponse> {
        let _res = new ProjectResponse();

        try {
        } catch (error) {
            _res.error = error;
        } finally {
            return _res;
        }
    }

    static async protectedPost(_Param: TParam): Promise<ProjectResponse> {
        let _res = new ProjectResponse();

        try {
        } catch (error) {
            _res.error = error;
        } finally {
            return _res;
        }
    }
}
