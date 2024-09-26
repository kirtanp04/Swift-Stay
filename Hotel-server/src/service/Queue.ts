import async from 'async';

export class QueueManager {
    private queues: { [key: string]: async.QueueObject<any> };

    constructor() {
        this.queues = {}; // Initialize an object to hold different queues
    }

    // Method to create a new named queue with a specified concurrency
    public createQueue(queueName: string, concurrency: number) {
        try {
            this.queues[queueName] = async.queue(this.processTask.bind(this, queueName), concurrency);
            console.log("New Que has been created" + queueName)
        } catch (error) {
            console.error(`Error whuile creating queue "${queueName}":`, error);
        }

    }

    // Task processor that handles the task based on the queue name
    private async processTask(queueName: string, task: any, callback: async.ErrorCallback<Error>) {
        try {
            // Handle task based on the queue name
            console.log(`Processing task from queue "${queueName}":`, task);
            // Simulate async processing (e.g., sending email, storing data, etc.)
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a delay
            console.log(`Task completed from queue "${queueName}":`, task);
            callback(null); // Signal task completion
        } catch (error: any) {
            console.error(`Error processing task from queue "${queueName}":`, error);
            callback(error); // Signal error
        }
    }

    // Method to add a task to the specified queue
    public addTask(queueName: string, task: any) {
        if (!this.queues[queueName]) {
            console.error(`Queue "${queueName}" does not exist. Please create it first.`);
            return;
        }
        this.queues[queueName].push(task, (err) => {
            if (err) {
                console.error(`Error processing task in queue "${queueName}":`, err);
            } else {
                console.log(`Task added to queue "${queueName}" successfully.`);
            }
        });
    }

    // Optional: Method to start processing tasks in a specified queue
    public startQueue(queueName: string) {
        if (!this.queues[queueName]) {
            console.error(`Queue "${queueName}" does not exist.`);
            return;
        }
        this.queues[queueName].drain(() => {
            console.log(`All tasks in queue "${queueName}" have been processed.`);
        });
    }
}
