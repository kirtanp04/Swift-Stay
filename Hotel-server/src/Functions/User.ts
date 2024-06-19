import { NextFunction, Request, Response } from "express"
import { UserResponse } from "../common/Response"
import { TParam } from "../types/Type"

export class UserFunction {
    protected _CreateUser: string = 'CreateUser'

    protected _UserLogin: string = 'UserLogin'

    // ----------------------------------------------------------------
    protected req: Request | undefined = undefined

    protected res: Response | undefined = undefined

    protected next: NextFunction | undefined = undefined

    // ----------------------------------------------------------------

    objUserResponse: UserResponse = new UserResponse()


    constructor(paramObj: TParam, req: Request, res: Response, next: NextFunction) {

        this.req = req

        this.res = res

        this.next = next


        if (paramObj.function === this._CreateUser) {

            this.CreateUser()

        }

        if (paramObj.function === this._UserLogin) {

            this.UserLogin()
        }


    }


    protected async CreateUser() {



    }
    protected async UserLogin() {

    }

}