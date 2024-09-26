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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatFunction = void 0;
const common_1 = require("../common");
const Constant_1 = require("../Constant");
const AdiminVerification_1 = require("../middleware/AdiminVerification");
const GuestVerification_1 = require("../middleware/GuestVerification");
const ChatModel_1 = require("../models/ChatModel");
const UserModel_1 = require("../models/UserModel");
const Redis_1 = require("../service/Redis");
const Type_1 = require("../types/Type");
// guest
const _GuestSaveChat = Constant_1.Param.function.guest.chat.saveChat;
// Admin
const _ManagerSaveChat = Constant_1.Param.function.manager.chat.saveChat;
// common
const _InitAdminRedis = Constant_1.Param.function.guest.chat.initRedisForChat;
const _InitGuestRedis = Constant_1.Param.function.guest.chat.initRedisForChat;
const _Redis = new Redis_1.Redis();
class ChatFunction {
}
exports.ChatFunction = ChatFunction;
_a = ChatFunction;
ChatFunction.objUserResponse = new common_1.UserResponse();
ChatFunction.findFunction = (objParam, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let _Function = new Functions();
    _Function.req = req;
    _Function.res = res;
    _Function.next = next;
    _Function.objParam = objParam;
    switch (objParam.function) {
        case _GuestSaveChat:
            _a.objUserResponse = yield _Function.SaveChatData();
            break;
        case _ManagerSaveChat:
            _a.objUserResponse = yield _Function.SaveChatData();
            break;
        case _InitGuestRedis:
            _a.objUserResponse = yield _Function.InitRedisForChat();
            break;
        case _InitAdminRedis:
            _a.objUserResponse = yield _Function.InitRedisForChat();
            break;
        default:
            _a.objUserResponse = (0, common_1.GetUserErrorObj)('Server error: Wronge Function.', common_1.HttpStatusCodes.BAD_REQUEST);
            break;
    }
    return _a.objUserResponse;
});
class Functions {
    constructor() {
        this.objUserResponse = new common_1.UserResponse();
        this.req = null;
        this.res = null;
        this.next = null;
        this.objParam = new Type_1.TParam();
        this.SaveChatData = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const chatData = this.objParam.data;
                let verifiyRes = new common_1.ProjectResponse();
                if (chatData.senderDetail.role === UserModel_1.enumUserRole.guest) {
                    verifiyRes = yield (0, GuestVerification_1.checkGuestVerification)(chatData.senderDetail._id);
                }
                if (chatData.senderDetail.role === UserModel_1.enumUserRole.admin) {
                    verifiyRes = yield (0, AdiminVerification_1.checkAdminVerification)(chatData.senderDetail._id);
                }
                if (verifiyRes.error === '') {
                    //storing in db
                    const isSaveChat = yield ChatModel_1.Chat.findOneAndUpdate({ key: chatData.key }, {
                        $push: {
                            chatInfo: chatData,
                        },
                    }, { upsert: true, new: true });
                    if (isSaveChat) {
                        const cacheData = common_1.Cache.getCacheData(Constant_1.CacheKey.chat(chatData.key));
                        if (cacheData.error === '') {
                            common_1.Cache.ClearCache(Constant_1.CacheKey.chat(chatData.key));
                        }
                        this.objUserResponse = (0, common_1.GetUserSuccessObj)(`Success to store Chat in DB`, common_1.HttpStatusCodes.OK);
                    }
                    else {
                        this.objUserResponse = (0, common_1.GetUserErrorObj)('Not able stored chat in DB', common_1.HttpStatusCodes.BAD_REQUEST);
                    }
                    //clear cache base on chat key
                }
                else {
                    this.objUserResponse = (0, common_1.GetUserErrorObj)(verifiyRes.error, common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                }
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_REQUEST);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.InitRedisForChat = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, role } = this.objParam.data;
                let res = new common_1.ProjectResponse();
                if (role === UserModel_1.enumUserRole.admin) {
                    res = yield (0, AdiminVerification_1.checkAdminVerification)(id);
                }
                if (role === UserModel_1.enumUserRole.guest) {
                    res = yield (0, GuestVerification_1.checkGuestVerification)(id);
                }
                if (res.error === '') {
                    const Redisres = yield _Redis.connect();
                    _Redis.subscribeAdminChat((mess) => {
                        console.log('Admin', mess);
                    }, (err) => {
                        console.log(err);
                    });
                    _Redis.subscribeUserChat((mess) => {
                        console.log('guest', mess);
                    }, (err) => {
                        console.log(err);
                    });
                    if (Redisres.error === '') {
                        this.objUserResponse = (0, common_1.GetUserSuccessObj)(Redisres.data, common_1.HttpStatusCodes.OK);
                    }
                    else {
                        this.objUserResponse = (0, common_1.GetUserErrorObj)(Redisres.error, common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                    }
                }
                else {
                    this.objUserResponse = (0, common_1.GetUserErrorObj)(res.error !== '' ? res.error : 'Server error: you are not a valid user.', common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                }
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_REQUEST);
            }
            finally {
                return this.objUserResponse;
            }
        });
    }
}
