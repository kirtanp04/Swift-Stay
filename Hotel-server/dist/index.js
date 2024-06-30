"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
const server_1 = require("./server");
const _CpuLength = os_1.default.availableParallelism();
const cluster = cluster_1.default;
if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    for (let i = 0; i < _CpuLength; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
    cluster.on('disconnect', (worker, code, signal) => {
        cluster.fork();
    });
}
else {
    const _Server = new server_1._Express();
    _Server.Port = 8080;
    _Server.connectToDB();
    _Server.listen();
}
