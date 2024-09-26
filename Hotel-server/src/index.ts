import Cluster, { Worker } from 'cluster';
import cpu from 'os';
import { _Express } from './server';
import { QueueManager } from './service/Queue';
import dotenv from 'dotenv';

const _CpuLength: number = cpu.availableParallelism();
const cluster: typeof Cluster = Cluster;

const _QueueManager: { [key in QueueNames]: { Queue: QueueManager; concurrency: number; queueName: string } } = {
    Email: {
        Queue: new QueueManager(),
        concurrency: 3,
        queueName: 'EmailQueue',
    },
    Chat: {
        Queue: new QueueManager(),
        concurrency: 1,
        queueName: 'Chat Queue',
    },
};

type QueueNames = 'Email' | 'Chat';

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers based on available CPU cores
    for (let i = 0; i < _CpuLength; i++) {
        cluster.fork();
    }

    // Access the concurrency level for each queue
    for (const key of Object.keys(_QueueManager) as QueueNames[]) {
        const concurrency = _QueueManager[key].concurrency;
        const queueName = _QueueManager[key].queueName;
        const Queue = _QueueManager[key].Queue;

        Queue.createQueue(queueName, concurrency);
    }

    // Handle worker exit and restart
    cluster.on('exit', (worker: Worker, code: number, signal: string) => {
        console.log(`worker ${worker.process.pid} died`);
    });

    cluster.on('disconnect', (worker: Worker) => {
        cluster.fork(); // Fork a new worker on disconnect
    });
} else {
    const _Server = new _Express();
    dotenv.config();
    _Server.Port = 8080;
    _Server.listen();
}

// const queueManager = new QueueManager();

// // Create queues for emails, data, and notifications
// queueManager.createQueue('emailQueue', 1); // Process emails one by one
// queueManager.createQueue('dataQueue', 2);  // Process data with concurrency of 2
// queueManager.createQueue('notificationQueue', 1); // Process notifications one by one

// // Add tasks to each queue
// queueManager.addTask('emailQueue', { subject: "Hello World", to: "user@example.com" });
// queueManager.addTask('dataQueue', { data: "Sample Data" });
// queueManager.addTask('notificationQueue', { message: "You have a new notification" });

// // Optionally start processing tasks in each queue
// queueManager.startQueue('emailQueue');
// queueManager.startQueue('dataQueue');
// queueManager.startQueue('notificationQueue');
