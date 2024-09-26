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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("../common");
const env_1 = require("../env");
class MongoDB {
}
exports.MongoDB = MongoDB;
_a = MongoDB;
MongoDB.ConnectDB = (next) => __awaiter(void 0, void 0, void 0, function* () {
    let _userRes = new common_1.UserResponse();
    if (mongoose_1.default.connection.readyState === 0) { // not connected yet
        try {
            yield mongoose_1.default.connect(env_1.SecrtKey.MNOGO_URL).then(() => {
                _userRes.isError = false;
                _userRes.data = 'Database Connection: Success';
            });
        }
        catch (error) {
            _userRes.Message = error;
            _userRes.isError = true;
        }
    }
    return _userRes;
});
