import Cluster, { Worker } from 'cluster';
import cpu from 'os';
import { _Express } from './server';

const _CpuLength: number = cpu.availableParallelism();
const cluster: typeof Cluster = Cluster;

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    for (let i = 0; i < _CpuLength; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker: Worker, code: number, signal: string) => {
        console.log(`worker ${worker.process.pid} died`);
    });

    cluster.on('disconnect', (worker: Worker, code: number, signal: string) => {
        cluster.fork();
    });
} else {
    const _Server = new _Express();

    _Server.Port = 8080

    _Server.listen();
}
