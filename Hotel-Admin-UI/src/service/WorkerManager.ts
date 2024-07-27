// src/WorkerManager.ts
export class WorkerManager {
    private worker: Worker | null = null;

    constructor(worker: Worker) {
        this.worker = worker;
    }

    terminate() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
    }

    postMessage(message: any) {
        if (this.worker) {
            this.worker.postMessage(message);
        }
    }

    onMessage(callback: (e: MessageEvent) => void) {
        if (this.worker) {
            this.worker.onmessage = callback;
        }
    }
}
