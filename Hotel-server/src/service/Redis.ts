import { createClient, RedisClientType } from 'redis'
import { Queue, Worker, Job, QueueEvents } from 'bullmq';
import { SecrtKey } from '../env';
import { Crypt } from '../common';
import { ChatObj } from '../types/Type';

export class Redis {
    private redisClient: RedisClientType;
    private publisher: RedisClientType;
    private subscriber: RedisClientType;
    private isConnected: boolean = false;
    private SubscribeUserChannelName: string = 'GetUserChatMess'; // channel for user to get user messages
    private SubscribeAdminChannelName: string = 'PublishAdminChatMess'; // channel for user to get admin messages
    private queueScheduler: QueueEvents | undefined = undefined;

    public queue: Queue | undefined = undefined;

    constructor() {
        this.redisClient = createClient({
            password: SecrtKey.REDIS.PASSWORD,
            socket: {
                host: SecrtKey.REDIS.URL,
                port: SecrtKey.REDIS.PORT
            }
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
            this.isConnected = false;  // Mark as not connected during reconnection attempts
        });

        client.on('end', () => {
            console.log('Redis client connection closed');
            this.isConnected = false;
        });

        client.on('warning', (warning: any) => {
            console.warn('Redis client warning:', warning);
        });
    }

    createQueue(queueName: string) {
        try {
            this.queue = new Queue(queueName, {
                connection: {
                    host: SecrtKey.REDIS.URL,
                    port: SecrtKey.REDIS.PORT,
                    password: SecrtKey.REDIS.PASSWORD
                }
            });

            this.queueScheduler = new QueueEvents(queueName, {
                connection: {
                    host: SecrtKey.REDIS.URL,
                    port: SecrtKey.REDIS.PORT,
                    password: SecrtKey.REDIS.PASSWORD
                }
            });


        } catch (error) {

        }
    }

    async connect(): Promise<void> {
        if (!this.isConnected) {
            await Promise.all([
                this.redisClient.connect(),
                this.publisher.connect(),
                this.subscriber.connect()
            ]);
            this.isConnected = true; // Mark as connected once all clients are connected
        } else {
            console.log('Redis client is already connected.');
        }
    }

    async subscribeAdminChat(onMessage: (message: ChatObj) => void, onError: (err: any) => void): Promise<void> {
        try {
            await this.subscriber.subscribe(this.SubscribeAdminChannelName, (message) => {
                const decryptObj = Crypt.Decryption(message);
                if (decryptObj.error === '') {
                    onMessage(decryptObj.data);
                } else {
                    onError(decryptObj.error);
                }
            });
        } catch (error) {
            onError(error);
        }
    }

    async subscribeUserChat(onMessage: (message: ChatObj) => void, onError: (err: any) => void): Promise<void> {
        try {
            await this.subscriber.subscribe(this.SubscribeUserChannelName, (message) => {
                const decryptObj = Crypt.Decryption(message);
                if (decryptObj.error === '') {
                    onMessage(decryptObj.data);
                } else {
                    onError(decryptObj.error);
                }
            });
        } catch (error) {
            onError(error);
        }
    }

    addWorker(name: string, processFunction: (job: Job) => Promise<void> | void, onError: (err: any) => void): Worker {
        return new Worker(name, async (job: Job) => {
            try {
                await processFunction(job);
                console.log(`Job ${job.id} processed successfully.`);
            } catch (error) {
                console.error(`Error processing job ${job.id}:`, error);
                onError(`Error processing job ${job.id}:` + error);
            }
        }, {
            connection: {
                host: SecrtKey.REDIS.URL,
                port: SecrtKey.REDIS.PORT,
                password: SecrtKey.REDIS.PASSWORD
            }
        });
    }
}
