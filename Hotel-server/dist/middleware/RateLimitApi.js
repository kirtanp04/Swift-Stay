"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainApiLimit = void 0;
const express_rate_limit_1 = require("express-rate-limit");
const Response_1 = require("../common/Response");
const UserResponse_1 = require("./UserResponse");
// const allowlist = ['192.168.0.56', '192.168.0.21'] //Ip address
exports.MainApiLimit = (0, express_rate_limit_1.rateLimit)({
    windowMs: 60 * 1000, // 1min,
    limit: 5, // 5 call
    legacyHeaders: true,
    standardHeaders: true,
    requestPropertyName: 'MainApiLimit',
    validate: true,
    handler: (req, res, next, options) => {
        let _UserResponse = new Response_1.UserResponse();
        _UserResponse = (0, Response_1.GetUserErrorObj)('Server Error: To many Api Calls. Wait for a 1min', options.statusCode);
        (0, UserResponse_1.SendResponseToUser)(_UserResponse, next);
    },
    // skip: (req, res) => allowlist.includes(req.ip),
});
