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
exports.SubscriberFunction = void 0;
const common_1 = require("../common");
const Constant_1 = require("../Constant");
const Type_1 = require("../types/Type");
const AdiminVerification_1 = require("../middleware/AdiminVerification");
const Subscriber_1 = require("../models/Subscriber");
const _ManagergellAllSubscriberList = Constant_1.Param.function.manager.subscriber.GetAllSubscriber;
class SubscriberFunction {
}
exports.SubscriberFunction = SubscriberFunction;
_a = SubscriberFunction;
SubscriberFunction.objUserResponse = new common_1.UserResponse();
SubscriberFunction.findFunction = (objParam, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let _Function = new Functions();
    _Function.req = req;
    _Function.res = res;
    _Function.next = next;
    _Function.objParam = objParam;
    if (objParam.function === _ManagergellAllSubscriberList) {
        const _res = yield _Function.GetAllSubscriberList();
        _a.objUserResponse = _res;
    }
    else {
        _a.objUserResponse = (0, common_1.GetUserErrorObj)('Server error: Wronge Function.', common_1.HttpStatusCodes.BAD_REQUEST);
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
        this.GetAllSubscriberList = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = this.objParam.data;
                const checkUser = yield (0, AdiminVerification_1.checkAdminVerification)(id);
                if (checkUser.error === '') {
                    const ManagerSubscribersCache = common_1.Cache.getCacheData(Constant_1.CacheKey.manager.subscriber(checkUser.data.email));
                    if (ManagerSubscribersCache.error === '') {
                        this.objUserResponse = (0, common_1.GetUserSuccessObj)(ManagerSubscribersCache.data, common_1.HttpStatusCodes.OK);
                    }
                    else {
                        const SubscriberList = yield Subscriber_1.Subscriber.find({ adminID: id }).populate('subscribers').exec();
                        if (SubscriberList) {
                            common_1.Cache.SetCache(Constant_1.CacheKey.manager.subscriber(checkUser.data.email), SubscriberList);
                            this.objUserResponse = (0, common_1.GetUserSuccessObj)(SubscriberList, common_1.HttpStatusCodes.OK);
                        }
                    }
                }
                else {
                    this.objUserResponse = (0, common_1.GetUserErrorObj)(checkUser.error, common_1.HttpStatusCodes.NOT_ACCEPTABLE);
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
