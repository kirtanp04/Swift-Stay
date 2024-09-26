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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserClass = exports.Login = exports.enumUserRole = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var enumUserRole;
(function (enumUserRole) {
    enumUserRole["guest"] = "guest";
    enumUserRole["admin"] = "admin";
})(enumUserRole || (exports.enumUserRole = enumUserRole = {}));
class Login {
    constructor() {
        this.email = "";
        this.password = "";
    }
}
exports.Login = Login;
class UserClass {
    constructor() {
        this._id = "";
        this.name = "";
        this.email = "";
        this.password = "";
        this.isEmailVerified = false;
        this.confirmPassword = "";
        this.country = '';
        this.profileImg = "";
        this.phone = "";
        this.role = enumUserRole.guest;
        this.createdAt = new Date();
    }
}
exports.UserClass = UserClass;
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true,
    },
    profileImg: {
        type: String,
    },
    country: {
        type: String,
        required: [true, 'Country is required.'],
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: [enumUserRole.guest, enumUserRole.admin],
        required: true,
    },
    createdAt: {
        type: Date,
    },
});
exports.User = mongoose_1.default.model('User', UserSchema);
