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
exports.Chat = exports.TChat = void 0;
const mongoose_1 = __importStar(require("mongoose"));
class TChat {
    constructor() {
        this.key = '';
        this.chatInfo = [];
    }
}
exports.TChat = TChat;
const ChatSchema = new mongoose_1.Schema({
    key: { type: String, required: [true, 'Chat key is required.'] },
    chatInfo: [{
            message: { type: String, required: [true, 'Message is required.'] },
            date: { type: Date, required: [true, 'Date is required.'] },
            senderDetail: {
                _id: { type: String, required: [true, 'Sender Id is required.'] },
                email: { type: String, required: [true, 'Sender Email is required.'] },
                name: { type: String, required: [true, 'Sender Name is required.'] },
                role: { type: String, required: [true, 'Sender Role is required.'] },
                profileImg: { type: String },
            },
        }]
});
ChatSchema.index({ key: 1 });
exports.Chat = mongoose_1.default.model('chat', ChatSchema);
