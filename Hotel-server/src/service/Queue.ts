import { Queue as BullQueue, Worker, Job } from 'bullmq';
import { Crypt } from '../common';
import { SecrtKey } from '../env';



export class _Queue {
    private _queue: BullQueue<any> | null = null;

    // Initialize the queue
    createQueue(queueName: string): void {
        if (this._queue) {
            console.warn(`Queue ${queueName} already exists.`);
            return;
        }

        this._queue = new BullQueue(queueName, {
            connection: {
                port: SecrtKey.REDIS.PORT,
                host: SecrtKey.REDIS.URL,
            }
        });
        console.log(`Queue ${queueName} created successfully.`);
    }

    // Add data to the queue
    async addDataInQueue(queueName: string, data: any): Promise<void> {
        if (!this._queue) {
            console.error('Queue not initialized. Call createQueue first.');
            return;
        }

        try {
            const encryptedData = Crypt.Encryption(data).data;
            await this._queue.add(queueName, encryptedData, {
                delay: 1500,
                removeOnComplete: true,
                removeOnFail: true,
            });
        } catch (error: any) {
            console.error('Error adding data to queue:', error.message);
        }
    }

    // Process jobs from the queue
    async processQueueData(queueName: string, onSuccess: (job: Job) => void, onFail: (err: any) => void): Promise<void> {
        if (!this._queue) {
            console.error('Queue not initialized. Call createQueue first.');
            return;
        }

        const worker = new Worker(queueName, async (job: Job) => {
            try {
                onSuccess(job);
            } catch (error) {
                onFail(error);
            }
        }, {
            connection: {
                port: SecrtKey.REDIS.PORT,
                host: SecrtKey.REDIS.URL,
            }
        });

        worker.on('completed', (job) => {
            console.log(`Job ${job.id} completed`);
        });

        worker.on('failed', (job, err) => {
            console.error(`Job ${job?.id} failed:`, err.message);
        });
    }
}
