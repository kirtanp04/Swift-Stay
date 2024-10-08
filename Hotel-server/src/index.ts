import Cluster, { Worker } from 'cluster';
import dotenv from 'dotenv';
import cpu from 'os';

import { _Express } from './server';

const _CpuLength: number = cpu.availableParallelism();
const cluster: typeof Cluster = Cluster;

dotenv.config();

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);


    for (let i = 0; i < _CpuLength; i++) {
        cluster.fork();


    }

    cluster.on('exit', (worker: Worker, code: number, signal: string) => {
        console.log(`Worker ${worker.process.pid} died`);
    });

    cluster.on('disconnect', (worker: Worker) => {
        cluster.fork(); // Fork a new worker on disconnect
    });
} else {


    const _Server = new _Express();
    _Server.Port = 8080;
    _Server.listen();
}
