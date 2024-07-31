import { NextFunction, Request, Response } from 'express'
import { Options, rateLimit } from 'express-rate-limit'
import { GetUserErrorObj, UserResponse } from '../common/Response'
import { SendResponseToUser } from './UserResponse'

// const allowlist = ['192.168.0.56', '192.168.0.21'] //Ip address

export const MainApiLimit = rateLimit({
    windowMs: 60 * 1000, // 1min,
    limit: 100, // 5 call
    legacyHeaders: true,
    standardHeaders: true,
    requestPropertyName: 'MainApiLimit',
    validate: true,
    handler: (req: Request, res: Response, next: NextFunction, options: Options) => {
        let _UserResponse = new UserResponse()

        _UserResponse = GetUserErrorObj('Server Error: To many Api Calls. Wait for a 1min', options.statusCode)

        SendResponseToUser(_UserResponse, next)
    },
    // skip: (req, res) => allowlist.includes(req.ip),
})