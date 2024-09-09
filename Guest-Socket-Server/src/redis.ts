import { createClient, RedisClientType } from "redis";
import { Crypt } from "./common";
import { SecrtKey } from "./env";
import { ChatObj } from "./Socket";

export class Redis {
    private redisClient: RedisClientType;
    private publisher: RedisClientType;
    private subscriber: RedisClientType;

    private PublishChannelName: string = "GetUserChatMess"; // channel for admin to get user messages
    private SubscribeChannelName: string = "PublishAdminChatMess"; // channel for user to get admin messages

    private isConnected: boolean = false;
    private isSubscribed: boolean = false; // Flag to prevent duplicate subscriptions

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
        client.on("error", (err: any) => {
            console.error("Redis Error:", err);
        });

        client.on("connect", () => {
            console.log("Redis client connected");
            this.isConnected = true;
        });

        client.on("ready", () => {
            console.log("Redis client ready to use");
        });

        client.on("reconnecting", () => {
            console.log("Redis client reconnecting...");
            this.isConnected = false;
        });

        client.on("end", () => {
            console.log("Redis client connection closed");
            this.isConnected = false;
        });

        client.on("warning", (warning: any) => {
            console.warn("Redis client warning:", warning);
        });
    }

    async connect(): Promise<void> {
        if (this.redisClient.isOpen) {
            console.log("Redis Already opened");
            return;
        }

        try {
            if (!this.isConnected) {
                await Promise.all([
                    this.redisClient.connect(),
                    this.publisher.connect(),
                    this.subscriber.connect(),
                ]);
                this.isConnected = true;
            } else {
                console.log("Redis client is already connected.");
            }
        } catch (error: any) {
            console.log("Redis Error:" + error.message);
        }
    }

    async publish(message: any, onSuccess: () => void, onError: (err: any) => void): Promise<void> {
        try {
            const encryptdata = Crypt.Encryption(message);
            if (encryptdata.error === "") {
                await this.publisher.publish(this.PublishChannelName, encryptdata.data);
                onSuccess()
            } else {
                onError(encryptdata.error);
            }
        } catch (error) {
            onError(error);
        }
    }

    async subscribe(
        onMessage: (message: ChatObj) => void,
        onError: (err: any) => void
    ): Promise<void> {
        if (this.isSubscribed) {
            console.log("Already subscribed to the channel.");
            return; // Prevent duplicate subscription
        }

        try {
            await this.subscriber.subscribe(this.SubscribeChannelName, (message) => {
                const decryptObj = Crypt.Decryption(message);
                if (decryptObj.error === "") {
                    onMessage(decryptObj.data);
                } else {
                    onError(decryptObj.error);
                }
            });

            this.isSubscribed = true; // Mark subscription as active
        } catch (error) {
            onError(error);
        }
    }

    async disconnect(): Promise<void> {
        if (this.isConnected) {
            await Promise.all([
                this.redisClient.disconnect(),
                this.publisher.disconnect(),
                this.subscriber.disconnect(),
            ]);
            console.log("Redis client disconnected");
            this.isConnected = false; // Reset the connection flag
        } else {
            console.log("Redis client is not connected.");
        }
    }
}
