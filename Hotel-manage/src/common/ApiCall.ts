import axiosCall from "src/service/axios";
import { ProjectResponse } from "./Response";
import { Crypt } from "./Crypt";
import { Jwt } from "./JWT";


export class TParam {
    Broker: string = ''

    function: string = ''

    data: any
}


export class Api {

    static async get(_Param: TParam): Promise<ProjectResponse> {
        let _res = new ProjectResponse()
        try {
            debugger

            const _objEncrypt = Jwt.SignJwt(_Param)

            if (_objEncrypt.error === '') {

                const response = await axiosCall.get(_objEncrypt.data)
                console.log(response)

            } else {
                _res.error = _objEncrypt.error
            }

        } catch (error) {

            _res.error = error

        } finally {
            return _res
        }
    }
    static async post(_Param: TParam, data: any): Promise<ProjectResponse> {
        let _res = new ProjectResponse()

        try {
            const _objEncrypt = Crypt.Encryption(_Param)
            if (_objEncrypt.error === '') {

                const response = await axiosCall.post(_objEncrypt.data, { data })
                console.log(response)

            } else {
                _res.error = _objEncrypt.error
            }

        } catch (error) {

            _res.error = error

        } finally {
            return _res
        }
    }

    static async protectedGet(_Param: TParam): Promise<ProjectResponse> {
        let _res = new ProjectResponse()

        try {



        } catch (error) {

            _res.error = error

        } finally {
            return _res
        }
    }

    static async protectedPost(_Param: TParam): Promise<ProjectResponse> {
        let _res = new ProjectResponse()

        try {



        } catch (error) {

            _res.error = error

        } finally {
            return _res
        }
    }
}