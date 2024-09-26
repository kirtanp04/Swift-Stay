"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueManager = void 0;
const queue_1 = __importDefault(require("queue"));
// QueueManager class that can handle any task type
class QueueManager {
    constructor(concurrency) {
        // Initialize the queue with custom concurrency
        this.queue = new queue_1.default({ concurrency, autostart: true });
    }
    // Method to add a task to the queue with a custom callback
    addTask(task, taskProcessor) {
        this.queue.push(() => __awaiter(this, void 0, void 0, function* () {
            try {
                yield taskProcessor(task);
                console.log('Task completed:', task);
            }
            catch (error) {
                console.error('Error processing task:', error);
            }
        }));
    }
    // Method to start the queue manually (optional)
    start() {
        this.queue.start((err) => {
            if (err)
                console.error('Queue encountered an error:', err);
            else
                console.log('All tasks completed');
        });
    }
    // Method to pause the queue (optional)
    pause() {
        this.queue.stop();
        console.log('Queue paused');
    }
}
exports.QueueManager = QueueManager;
