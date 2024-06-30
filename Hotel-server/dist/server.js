"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._Express = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require('dotenv').config();
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const GuestBroker_1 = __importDefault(require("./BrokerRoute/GuestBroker"));
const ManagerBroker_1 = __importDefault(require("./BrokerRoute/ManagerBroker"));
const Response_1 = require("./common/Response");
const UserResponse_1 = require("./middleware/UserResponse");
const RateLimitApi_1 = require("./middleware/RateLimitApi");
const MongoDB_1 = require("./DB/MongoDB");
const _app = (0, express_1.default)();
class _Express {
    constructor() {
        this.Port = 8080;
        this.middleware();
        this.route();
    }
    middleware() {
        _app.use((0, cors_1.default)({
            credentials: true,
            methods: 'GET,POST',
            optionsSuccessStatus: 201,
            origin: 'http://localhost:5173'
        }));
        _app.use((0, helmet_1.default)());
        _app.use((0, compression_1.default)({
            level: 9,
            threshold: 512,
            filter: (req, res) => {
                if (req.headers['x-no-compression']) {
                    return false;
                }
                return compression_1.default.filter(req, res);
            }
        }));
        _app.use(body_parser_1.default.json({ limit: '50mb' }));
        _app.use(body_parser_1.default.urlencoded({ extended: true, limit: '50mb', parameterLimit: 2 }));
        _app.use(express_1.default.json({ limit: '50mb' }));
        _app.use((0, cookie_parser_1.default)());
    }
    route() {
        _app.use('/swiftstay/guest/api', RateLimitApi_1.MainApiLimit, GuestBroker_1.default);
        _app.use('/swiftstay/manager/api', RateLimitApi_1.MainApiLimit, ManagerBroker_1.default);
        _app.all('*', (req, res, next) => {
            let objUserResponse = new Response_1.UserResponse();
            objUserResponse.Message = 'API error / Path not found.';
            objUserResponse.isError = true;
            objUserResponse.statusCode = 404;
            (0, UserResponse_1.SendResponseToUser)(objUserResponse, next);
        });
        _app.use(UserResponse_1.UserResponseMiddWare); // sending data to user middle ware
    }
    connectToDB() {
        MongoDB_1.MongoDB.ConnectDB();
    }
    listen() {
        try {
            _app.listen(this.Port, () => {
                console.log('Server started on Port' + this.Port);
            });
        }
        catch (error) {
            console.log('Error while Starting Server -> ' + error);
        }
    }
}
exports._Express = _Express;
