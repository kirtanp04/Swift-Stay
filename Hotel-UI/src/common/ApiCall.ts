import axiosCall from "src/service/axios";
import { ProjectResponse } from "./Response";


export class Api {

    static async get(param: string): Promise<ProjectResponse> {
        let _res = new ProjectResponse()

        try {

            const response = await axiosCall.get(param)
            console.log(response)

        } catch (error) {

            _res.error = error

        } finally {
            return _res
        }
    }
}