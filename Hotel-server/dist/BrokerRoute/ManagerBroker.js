"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const common_1 = require("../common");
const Crypt_1 = require("../common/Crypt");
const Constant_1 = require("../Constant");
const MongoDB_1 = require("../DB/MongoDB");
const Functions = __importStar(require("../Functions/index"));
const UserResponse_1 = require("../middleware/UserResponse");
const ManagerBrokerRouter = express_1.default.Router();
const _ManagerAuthBroker = Constant_1.Param.broker.manager.Auth;
const _ManagerPropertyBroker = Constant_1.Param.broker.manager.Property;
const _ManagerRoomBroker = Constant_1.Param.broker.manager.Room;
const _ManagerChatBroker = Constant_1.Param.broker.manager.chat;
const _ManagerSubscriberBroker = Constant_1.Param.broker.manager.subscriber;
const _ManagerReviewBroker = Constant_1.Param.broker.manager.review;
const _ManagerBookingBroker = Constant_1.Param.broker.manager.booking;
const _ManagerAnalyticBroker = Constant_1.Param.broker.manager.analytic;
const _ManagerJobBroker = Constant_1.Param.broker.manager.Job;
ManagerBrokerRouter.get('/:param', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isDBConnected = yield MongoDB_1.MongoDB.ConnectDB(next);
        if (isDBConnected.isError === false) {
            const { param } = req.params;
            const objDecrypt = Crypt_1.Crypt.Decryption(param);
            if (objDecrypt.error === '') {
                const paramObj = objDecrypt.data;
                switch (paramObj.Broker) {
                    case _ManagerAuthBroker:
                        return (0, UserResponse_1.SendResponseToUser)(yield Functions.UserFunction.findFunction(paramObj, req, res, next), next);
                    case _ManagerPropertyBroker:
                        return (0, UserResponse_1.SendResponseToUser)(yield Functions.PropertyFunction.findFunction(paramObj, req, res, next), next);
                    case _ManagerSubscriberBroker:
                        return (0, UserResponse_1.SendResponseToUser)(yield Functions.SubscriberFunction.findFunction(paramObj, req, res, next), next);
                    case _ManagerRoomBroker:
                        return (0, UserResponse_1.SendResponseToUser)(yield Functions.RoomFunction.findFunction(paramObj, req, res, next), next);
                    case _ManagerReviewBroker:
                        return (0, UserResponse_1.SendResponseToUser)(yield Functions.ReviewFunction.findFunction(paramObj, req, res, next), next);
                    case _ManagerBookingBroker:
                        return (0, UserResponse_1.SendResponseToUser)(yield Functions.BookingFunction.findFunction(paramObj, req, res, next), next);
                    case _ManagerAnalyticBroker:
                        return (0, UserResponse_1.SendResponseToUser)(yield Functions.AnalyticFunction.findFunction(paramObj, req, res, next), next);
                    case _ManagerChatBroker:
                        return (0, UserResponse_1.SendResponseToUser)(yield Functions.ChatFunction.findFunction(paramObj, req, res, next), next);
                    case _ManagerJobBroker:
                        return (0, UserResponse_1.SendResponseToUser)(yield Functions.JobFunction.findFunction(paramObj, req, res, next), next);
                    default:
                        const errMess = (0, common_1.GetUserErrorObj)('Server error: Wrong Broker', common_1.HttpStatusCodes.BAD_REQUEST);
                        return (0, UserResponse_1.SendResponseToUser)(errMess, next);
                }
            }
            else {
                return (0, UserResponse_1.SendResponseToUser)((0, common_1.GetUserErrorObj)(`Server Error: ${objDecrypt.error}`, common_1.HttpStatusCodes.BAD_REQUEST), next);
            }
        }
        else {
            return (0, UserResponse_1.SendResponseToUser)((0, common_1.GetUserErrorObj)(` ${isDBConnected.Message}`, common_1.HttpStatusCodes.BAD_REQUEST), next);
        }
    }
    catch (error) {
        return (0, UserResponse_1.SendResponseToUser)((0, common_1.GetUserErrorObj)(`Server Error: ${error.message}`, common_1.HttpStatusCodes.BAD_REQUEST), next);
    }
}));
ManagerBrokerRouter.post('/:param', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isDBConnected = yield MongoDB_1.MongoDB.ConnectDB(next);
        if (isDBConnected.isError === false) {
            const { param } = req.params;
            const objDecrypt = Crypt_1.Crypt.Decryption(param);
            if (objDecrypt.error === '') {
                const decryptResBody = Crypt_1.Crypt.Decryption(req.body.data);
                if (decryptResBody.error === '') {
                    let paramObj = objDecrypt.data;
                    paramObj.data = decryptResBody.data;
                    switch (paramObj.Broker) {
                        case _ManagerAuthBroker:
                            return (0, UserResponse_1.SendResponseToUser)(yield Functions.UserFunction.findFunction(paramObj, req, res, next), next);
                        case _ManagerPropertyBroker:
                            return (0, UserResponse_1.SendResponseToUser)(yield Functions.PropertyFunction.findFunction(paramObj, req, res, next), next);
                        case _ManagerRoomBroker:
                            return (0, UserResponse_1.SendResponseToUser)(yield Functions.RoomFunction.findFunction(paramObj, req, res, next), next);
                        case _ManagerBookingBroker:
                            return (0, UserResponse_1.SendResponseToUser)(yield Functions.BookingFunction.findFunction(paramObj, req, res, next), next);
                        case _ManagerAnalyticBroker:
                            return (0, UserResponse_1.SendResponseToUser)(yield Functions.AnalyticFunction.findFunction(paramObj, req, res, next), next);
                        case _ManagerSubscriberBroker:
                            return (0, UserResponse_1.SendResponseToUser)(yield Functions.SubscriberFunction.findFunction(paramObj, req, res, next), next);
                        case _ManagerChatBroker:
                            return (0, UserResponse_1.SendResponseToUser)(yield Functions.ChatFunction.findFunction(paramObj, req, res, next), next);
                        case _ManagerJobBroker:
                            return (0, UserResponse_1.SendResponseToUser)(yield Functions.JobFunction.findFunction(paramObj, req, res, next), next);
                        default:
                            const errMess = (0, common_1.GetUserErrorObj)('Server error: Wrong Broker', common_1.HttpStatusCodes.BAD_REQUEST);
                            return (0, UserResponse_1.SendResponseToUser)(errMess, next);
                    }
                }
                else {
                    const errMess = (0, common_1.GetUserErrorObj)('Server error: Not able to decrypt body', common_1.HttpStatusCodes.BAD_REQUEST);
                    return (0, UserResponse_1.SendResponseToUser)(errMess, next);
                }
            }
            else {
                return (0, UserResponse_1.SendResponseToUser)((0, common_1.GetUserErrorObj)(`Server Error: ${objDecrypt.error} + Params`, common_1.HttpStatusCodes.BAD_REQUEST), next);
            }
        }
        else {
            return (0, UserResponse_1.SendResponseToUser)((0, common_1.GetUserErrorObj)(` ${isDBConnected.Message}`, common_1.HttpStatusCodes.BAD_REQUEST), next);
        }
    }
    catch (error) {
        return (0, UserResponse_1.SendResponseToUser)((0, common_1.GetUserErrorObj)(`Server Error: ${error.message}`, common_1.HttpStatusCodes.BAD_REQUEST), next);
    }
}));
exports.default = ManagerBrokerRouter;
