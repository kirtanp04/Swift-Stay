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
exports.Email = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../env");
class Email {
    constructor({ EMAIL_AUTH_USER, EMAIL_AUTH_PASS, ID }) {
        this.from = '';
        this.to = '';
        this.subject = '';
        this.html = '';
        this.text = '';
        this.EMAIL_AUTH_USER = EMAIL_AUTH_USER || env_1.SecrtKey.NODEMAILER.EMAIL_AUTH_USER;
        this.EMAIL_AUTH_PASS = EMAIL_AUTH_PASS || env_1.SecrtKey.NODEMAILER.EMAIL_AUTH_PASS;
        this.ID = ID || '';
        this.host = env_1.SecrtKey.NODEMAILER.EMAIL_HOST;
        this.port = 587;
        this.transporter = this.createTransport();
    }
    createTransport() {
        return nodemailer_1.default.createTransport({
            host: this.host,
            port: this.port,
            secure: this.port === 465,
            auth: {
                user: this.EMAIL_AUTH_USER,
                pass: this.EMAIL_AUTH_PASS,
            },
            service: 'gmail',
        });
    }
    sendEmail(onsuccess, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const info = yield this.transporter.sendMail({
                    from: '"' + 'Swift Stay' + '"' + '<' + this.EMAIL_AUTH_USER + '>',
                    to: this.to,
                    subject: this.subject,
                    text: this.text,
                    html: this.html,
                });
                onsuccess();
            }
            catch (error) {
                callback('Email Server Error: ' + error.message);
            }
        });
    }
}
exports.Email = Email;
