const CustomWorker = require('../objects/custom-worker.object');

class WorkerHandler {
    workers = {};

    static getInstance() {
        if (!WorkerHandler.instance) {
            WorkerHandler.instance = new WorkerHandler();
        }
        return WorkerHandler.instance;
    }

    loadWorkers() {
        try {
            const worker = new CustomWorker(__dirname + '/file.processor.js');
            worker.on('message', result => {
                worker.success(result);
            });

            worker.on('error', err => {
                console.error('[!] Worker error:', err);
                worker.failure(err);
            });

            this.workers['FileProcessor'] = worker;
        } catch (err) {
            console.error('[!] WorkerHandler error:', err);
        }
    }

    closeWorkers() {
        Object.entries(this.workers).map(entry => {
            entry[1].terminate(); // Terminate the worker
        });
        this.workers = {};
    }

    invokeWorker(workerName, data) {
        this.workers[workerName].postMessage(data);
        return this.workers[workerName];
    }
}

module.exports = WorkerHandler;
