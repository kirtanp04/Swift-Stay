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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Redis = void 0;
const redis_1 = require("redis");
const common_1 = require("../common");
const env_1 = require("../env");
class Redis {
    constructor() {
        this.isConnected = false;
        this.SubscribeUserChannelName = 'GetUserChatMess';
        this.SubscribeAdminChannelName = 'PublishAdminChatMess';
        this.isSubscribedAdmin = false;
        this.isSubscribedUser = false;
        this.processedMessages = new Set();
        this.redisClient = (0, redis_1.createClient)({
            password: env_1.SecrtKey.REDIS.PASSWORD,
            socket: {
                host: env_1.SecrtKey.REDIS.URL,
                port: env_1.SecrtKey.REDIS.PORT,
            },
        });
        this.publisher = this.redisClient.duplicate();
        this.subscriber = this.redisClient.duplicate();
        this.addEventHandlers(this.redisClient);
        this.addEventHandlers(this.publisher);
        this.addEventHandlers(this.subscriber);
    }
    addEventHandlers(client) {
        client.on('error', (err) => {
            console.error('Redis Error:', err);
        });
        client.on('connect', () => {
            console.log('Redis client connected');
            this.isConnected = true;
        });
        client.on('ready', () => {
            console.log('Redis client ready to use');
        });
        client.on('reconnecting', () => {
            console.log('Redis client reconnecting...');
            this.isConnected = false;
        });
        client.on('end', () => {
            console.log('Redis client connection closed');
            this.isConnected = false;
        });
        client.on('warning', (warning) => {
            console.warn('Redis client warning:', warning);
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = new common_1.ProjectResponse();
            try {
                if (!this.isConnected && !this.redisClient.isOpen) {
                    yield Promise.all([this.redisClient.connect(), this.publisher.connect(), this.subscriber.connect()]);
                    this.isConnected = true;
                    res.data = 'Redis is connected successfully';
                    res.error = '';
                }
                else {
                    res.data = 'Redis is already connected';
                    res.error = '';
                }
            }
            catch (error) {
                res.data = '';
                res.error = 'Redis Error:' + error.message;
            }
            finally {
                return res;
            }
        });
    }
    subscribeAdminChat(onMessage, onError) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isSubscribedAdmin) {
                console.log('Already subscribed to admin channel.');
                return;
            }
            try {
                yield this.subscriber.subscribe(this.SubscribeAdminChannelName, (message) => {
                    const decryptObj = common_1.Crypt.Decryption(message);
                    if (decryptObj.error === '') {
                        this.processAndHandleMessage(decryptObj.data, onMessage);
                    }
                    else {
                        onError(decryptObj.error);
                    }
                });
                this.isSubscribedAdmin = true;
            }
            catch (error) {
                onError(error);
            }
        });
    }
    subscribeUserChat(onMessage, onError) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isSubscribedUser) {
                console.log('Already subscribed to user channel.');
                return;
            }
            try {
                yield this.subscriber.subscribe(this.SubscribeUserChannelName, (message) => {
                    const decryptObj = common_1.Crypt.Decryption(message);
                    if (decryptObj.error === '') {
                        this.processAndHandleMessage(decryptObj.data, onMessage);
                    }
                    else {
                        onError(decryptObj.error);
                    }
                });
                this.isSubscribedUser = true;
            }
            catch (error) {
                onError(error);
            }
        });
    }
    processAndHandleMessage(message, onMessage) {
        const messageId = message.date;
        if (!this.processedMessages.has(messageId)) {
            this.processedMessages.add(messageId);
            onMessage(message);
        }
        else {
            console.log(`Duplicate message with id: ${messageId} ignored.`);
        }
    }
    cleanProcessedMessages() {
        this.processedMessages.clear();
    }
}
exports.Redis = Redis;
