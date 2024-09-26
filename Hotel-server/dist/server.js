"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._Express = exports._app = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const GuestBroker_1 = __importDefault(require("./BrokerRoute/GuestBroker"));
const ManagerBroker_1 = __importDefault(require("./BrokerRoute/ManagerBroker"));
const Response_1 = require("./common/Response");
const Constant_1 = require("./Constant");
const MongoDB_1 = require("./DB/MongoDB");
const env_1 = require("./env");
const Functions_1 = require("./Functions");
const RateLimitApi_1 = require("./middleware/RateLimitApi");
const UserResponse_1 = require("./middleware/UserResponse");
const Type_1 = require("./types/Type");
exports._app = (0, express_1.default)();
class _Express {
    constructor() {
        this.Port = 8080;
        this.middleware();
        this.route();
    }
    middleware() {
        exports._app.use((0, compression_1.default)({
            level: 9,
            threshold: 512,
            filter: (req, res) => {
                if (req.headers['x-no-compression']) {
                    return false;
                }
                return compression_1.default.filter(req, res);
            },
        }));
        exports._app.use((0, cors_1.default)({
            credentials: true,
            methods: 'GET,POST',
            optionsSuccessStatus: 201,
            origin: [env_1.SecrtKey.FRONTEND_URL.ADMIN, env_1.SecrtKey.FRONTEND_URL.GUEST],
            // origin: [SecrtKey.FRONTEND_URL.ADMIN, SecrtKey.FRONTEND_URL.GUEST],
        }));
        exports._app.use((0, helmet_1.default)());
        exports._app.use(body_parser_1.default.json({ limit: '50mb' }));
        exports._app.use(body_parser_1.default.urlencoded({ extended: true, limit: '50mb', parameterLimit: 2 }));
        exports._app.use(express_1.default.json({ limit: '50mb' }));
        exports._app.use((0, cookie_parser_1.default)());
        exports._app.use(body_parser_1.default.raw({ type: 'application/json' }));
    }
    route() {
        exports._app.use('/swiftstay/guest/api', RateLimitApi_1.MainApiLimit, GuestBroker_1.default);
        exports._app.use('/swiftstay/manager/api', RateLimitApi_1.MainApiLimit, ManagerBroker_1.default);
        exports._app.post('/swiftstay/guest/webhook', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const isDBConnected = yield MongoDB_1.MongoDB.ConnectDB(next);
                if (!isDBConnected.isError) {
                    const param = new Type_1.TParam();
                    param.function = Constant_1.Param.function.guest.payment.WebHook;
                    param.data = req.body;
                    return (0, UserResponse_1.SendResponseToUser)(yield Functions_1.PaymentFunction.findFunction(param, req, res, next), next);
                }
                else {
                    let objUserResponse = new Response_1.UserResponse();
                    objUserResponse.Message = 'not able to connect to DB';
                    objUserResponse.isError = true;
                    objUserResponse.statusCode = 404;
                    (0, UserResponse_1.SendResponseToUser)(objUserResponse, next);
                    return (0, UserResponse_1.SendResponseToUser)(objUserResponse, next);
                }
            }
            catch (error) {
                let objUserResponse = new Response_1.UserResponse();
                objUserResponse.Message = error.message;
                objUserResponse.isError = true;
                objUserResponse.statusCode = 404;
                (0, UserResponse_1.SendResponseToUser)(objUserResponse, next);
                return (0, UserResponse_1.SendResponseToUser)(objUserResponse, next);
            }
        }));
        exports._app.all('*', (req, res, next) => {
            let objUserResponse = new Response_1.UserResponse();
            objUserResponse.Message = 'API error / Path not found.';
            objUserResponse.isError = true;
            objUserResponse.statusCode = 404;
            (0, UserResponse_1.SendResponseToUser)(objUserResponse, next);
        });
        exports._app.use(UserResponse_1.UserResponseMiddWare); // sending data to user middle ware
    }
    listen() {
        try {
            exports._app.listen(this.Port, () => {
                console.log('Server started on Port' + this.Port);
            });
        }
        catch (error) {
            console.log('Error while Starting Server -> ' + error);
        }
    }
}
exports._Express = _Express;
