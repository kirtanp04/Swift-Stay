import Cluster, { Worker } from 'cluster';
import cpu from 'os';
import { _Express } from './server';
import { _Queue } from './service/Queue';
import { QueueName } from './Constant';
require('dotenv').config();

const _CpuLength: number = cpu.availableParallelism();
const cluster: typeof Cluster = Cluster;
export const Queue = new _Queue()


if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    for (let i = 0; i < _CpuLength; i++) {
        cluster.fork();
    }

    // Queue.createQueue(QueueName.EmailQueue)

    cluster.on('exit', (worker: Worker, code: number, signal: string) => {
        console.log(`worker ${worker.process.pid} died`);
    });

    cluster.on('disconnect', (worker: Worker, code: number, signal: string) => {
        cluster.fork();
    });
} else {
    const _Server = new _Express();
    _Server.Port = 8080;
    _Server.listen();
}
