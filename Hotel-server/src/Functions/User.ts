import { NextFunction, Request, Response } from "express"
import { GetUserErrorObj, UserResponse } from "../common/Response"
import { TParam } from "../types/Type"
import { User, UserClass } from "../models/UserModel"
import { Crypt } from "../common/Crypt"
import { HttpStatusCodes } from "../common/HTTPStatusCode"

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

        const { createdAt, email, name, password, phone, profileImg, role } = this.req?.body as UserClass

        try {

            const isUser = await User.findOne({ email: email })

            if (isUser) {
                this.objUserResponse = GetUserErrorObj('User already exist. Enter another user name.', 403)
            } else {
                const objHashPass = await Crypt.hashValue(password)

                if (objHashPass.error !== '') {
                    this.objUserResponse = GetUserErrorObj(objHashPass.error, HttpStatusCodes.BAD_REQUEST)
                } else {
                    const newUser = await User.create({
                        createdAt, email, name, phone, profileImg, role, password: objHashPass.data
                    })
                    newUser.save()
                }
            }

        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error, HttpStatusCodes.BAD_REQUEST)
        }


    }
    protected async UserLogin() {

    }

}