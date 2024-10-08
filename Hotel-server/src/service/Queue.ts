type TaskFunction = () => Promise<any>;

export class QueueManager {
    private queues: { [queueName: string]: TaskFunction[] } = {};
    private isProcessing: { [queueName: string]: boolean } = {};
    private concurrencyMap: { [queueName: string]: number } = {};


    public createQueue(queueName: string, concurrency: number) {

        if (this.queues[queueName] === undefined || this.queues[queueName] === null) {
            this.queues[queueName] = [];
            this.isProcessing[queueName] = false;
            this.concurrencyMap[queueName] = concurrency;
            console.log(`Queue "${queueName}" created with concurrency: ${concurrency}`);
        }

    }


    public addTask(queueName: string, task: TaskFunction) {
        const queue = this.queues[queueName];
        if (!queue) {
            throw new Error(`Queue "${queueName}" does not exist. Please create it first.`);
        }

        queue.push(task);
        console.log(`Task added to queue "${queueName}"`);

        if (!this.isProcessing[queueName]) {
            this.processQueue(queueName);
        }
    }


    private async processQueue(queueName: string) {
        this.isProcessing[queueName] = true;

        const queue = this.queues[queueName];
        const concurrency = this.concurrencyMap[queueName];
        const processingPromises: Promise<void>[] = [];

        while (queue.length > 0 && processingPromises.length < concurrency) {
            const task = queue.shift();
            if (task) {
                processingPromises.push(task().catch((error) => {
                    console.error(`Error processing task in queue "${queueName}":`, error);
                }));
            }
        }


        await Promise.all(processingPromises);


        if (queue.length > 0) {
            this.processQueue(queueName);
        } else {
            this.isProcessing[queueName] = false;
        }
    }
}



