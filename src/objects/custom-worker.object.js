const {Worker} = require('worker_threads');

class CustomWorker extends Worker {
    successCallbacks = [];
    errorCallbacks = [];

    /**
     * Add a new callback to the queue to be called when notify() method is trigger
     * @param callback: Function
     */
    onSuccess(callback) {
        this.successCallbacks.push(callback);
        return this;
    }

    /**
     * Calls to every callback in the queue to run their respective flows
     * @param data: any
     */
    success(data) {
        this.successCallbacks.forEach(callback => {
            callback(data);
        })
    }

    /**
     * Calls to every callback in the queue to run their respective flows
     * @param err: any
     */
    failure(err) {
        this.errorCallbacks.forEach(callback => {
            callback(err);
        })
    }

    /**
     * Add a new callback to the queue to be called when error() method is trigger
     * @param callback: Function
     */
    onFailure(callback) {
        this.errorCallbacks.push(callback);
        return this;
    }
}

module.exports = CustomWorker;
