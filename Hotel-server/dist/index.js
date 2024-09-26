"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
const server_1 = require("./server");
const Queue_1 = require("./service/Queue");
const dotenv_1 = __importDefault(require("dotenv"));
const _CpuLength = os_1.default.availableParallelism();
const cluster = cluster_1.default;
exports.Queue = new Queue_1.QueueManager(1);
if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    for (let i = 0; i < _CpuLength; i++) {
        cluster.fork();
    }
    // Queue.createQueue(QueueName.EmailQueue)
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
    cluster.on('disconnect', (worker, code, signal) => {
        cluster.fork();
    });
}
else {
    const _Server = new server_1._Express();
    dotenv_1.default.config();
    _Server.Port = 8080;
    _Server.listen();
}
