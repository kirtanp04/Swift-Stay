import { NextFunction, Request, Response } from 'express'
import { Options, rateLimit } from 'express-rate-limit'
import { UserResponse } from '../common/Response'
import { SendResponseToUser } from './UserResponse'

// const allowlist = ['192.168.0.56', '192.168.0.21'] //Ip address

export const MainApiLimit = rateLimit({
    windowMs: 60 * 1000, // 1min,
    limit: 5, // 5 call
    legacyHeaders: true,
    standardHeaders: true,
    requestPropertyName: 'MainApiLimit',
    validate: true,
    handler: (req: Request, res: Response, next: NextFunction, options: Options) => {
        let _UserResponse = new UserResponse()

        _UserResponse.Message = options.message
        _UserResponse.data = ''
        _UserResponse.isError = true
        _UserResponse.statusCode = options.statusCode

        SendResponseToUser(_UserResponse, next)
    },
    // skip: (req, res) => allowlist.includes(req.ip),
})