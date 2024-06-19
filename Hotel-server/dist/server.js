"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._Express = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const Response_1 = require("./common/Response");
const UserResponse_1 = require("./middleware/UserResponse");
const Broker_1 = __importDefault(require("./BrokerRoute/Broker"));
const _app = (0, express_1.default)();
class _Express {
    constructor() {
        this.Port = 8080;
        this.middleware();
        this.route();
    }
    middleware() {
        _app.use((0, cors_1.default)());
        _app.use(body_parser_1.default.json());
        _app.use(body_parser_1.default.urlencoded({ extended: true, limit: '10mb', parameterLimit: 2 }));
        _app.use(express_1.default.json());
        _app.use((0, cookie_parser_1.default)());
    }
    route() {
        // _app.get('/hotel/api', (req, res) => {
        //   res.send({ data: 'hello' })
        // })
        _app.use('/hotel/api', Broker_1.default);
        _app.all('*', (req, res, next) => {
            let objUserResponse = new Response_1.UserResponse();
            objUserResponse.Message = 'API error / Path not found.';
            objUserResponse.isError = true;
            objUserResponse.statusCode = 404;
            (0, UserResponse_1.SendResponseToUser)(objUserResponse, next);
        });
        _app.use(UserResponse_1.UserResponseMiddWare); // sending data to user middle ware
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
