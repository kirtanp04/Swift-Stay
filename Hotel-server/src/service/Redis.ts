import { createClient, RedisClientType } from 'redis';
import { Crypt, ProjectResponse } from '../common';
import { SecrtKey } from '../env';
import { ChatObj } from '../types/Type';

export class Redis {
    private redisClient: RedisClientType;
    private publisher: RedisClientType;
    private subscriber: RedisClientType;
    private isConnected: boolean = false;

    private SubscribeUserChannelName: string = 'GetUserChatMess';
    private SubscribeAdminChannelName: string = 'PublishAdminChatMess';
    private isSubscribedAdmin: boolean = false;
    private isSubscribedUser: boolean = false;

    private processedMessages: Set<string> = new Set();

    constructor() {
        this.redisClient = createClient({
            password: SecrtKey.REDIS.PASSWORD,
            socket: {
                host: SecrtKey.REDIS.URL,
                port: SecrtKey.REDIS.PORT,
            },
        });

        this.publisher = this.redisClient.duplicate();
        this.subscriber = this.redisClient.duplicate();

        this.addEventHandlers(this.redisClient);
        this.addEventHandlers(this.publisher);
        this.addEventHandlers(this.subscriber);
    }

    private addEventHandlers(client: RedisClientType): void {
        client.on('error', (err: any) => {
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

        client.on('warning', (warning: any) => {
            console.warn('Redis client warning:', warning);
        });
    }

    async connect(): Promise<ProjectResponse> {
        const res = new ProjectResponse();
        try {
            if (!this.isConnected && !this.redisClient.isOpen) {
                await Promise.all([this.redisClient.connect(), this.publisher.connect(), this.subscriber.connect()]);
                this.isConnected = true;
                res.data = 'Redis is connected successfully';
                res.error = '';
            } else {
                res.data = 'Redis is already connected';
                res.error = '';
            }
        } catch (error: any) {
            res.data = '';
            res.error = 'Redis Error:' + error.message;
        } finally {
            return res;
        }
    }

    async subscribeAdminChat(onMessage: (message: ChatObj) => void, onError: (err: any) => void): Promise<void> {
        if (this.isSubscribedAdmin) {
            console.log('Already subscribed to admin channel.');
            return;
        }

        try {
            await this.subscriber.subscribe(this.SubscribeAdminChannelName, (message) => {
                const decryptObj = Crypt.Decryption(message);
                if (decryptObj.error === '') {
                    this.processAndHandleMessage(decryptObj.data, onMessage);
                } else {
                    onError(decryptObj.error);
                }
            });

            this.isSubscribedAdmin = true;
        } catch (error) {
            onError(error);
        }
    }

    async subscribeUserChat(onMessage: (message: ChatObj) => void, onError: (err: any) => void): Promise<void> {
        if (this.isSubscribedUser) {
            console.log('Already subscribed to user channel.');
            return;
        }

        try {
            await this.subscriber.subscribe(this.SubscribeUserChannelName, (message) => {
                const decryptObj = Crypt.Decryption(message);
                if (decryptObj.error === '') {
                    this.processAndHandleMessage(decryptObj.data, onMessage);
                } else {
                    onError(decryptObj.error);
                }
            });

            this.isSubscribedUser = true;
        } catch (error) {
            onError(error);
        }
    }

    private processAndHandleMessage(message: ChatObj, onMessage: (message: ChatObj) => void): void {
        const messageId = message.date as string;

        if (!this.processedMessages.has(messageId)) {
            this.processedMessages.add(messageId);
            onMessage(message);
        } else {
            console.log(`Duplicate message with id: ${messageId} ignored.`);
        }
    }

    cleanProcessedMessages(): void {
        this.processedMessages.clear();
    }
}
