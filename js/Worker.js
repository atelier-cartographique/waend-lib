"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
exports.EventRenderFrame = 'render:frame';
exports.EventRenderInit = 'render:init';
exports.EventRenderUpdate = 'render:update';
class WaendWorker extends events_1.EventEmitter {
    constructor(url) {
        super();
        this.url = url;
    }
    post(message) {
        this.worker.postMessage(message);
    }
    start() {
        this.worker = new Worker(this.url);
        this.worker.addEventListener('message', this.onMessageHandler(), false);
        this.worker.addEventListener('error', this.onErrorHandler(), false);
        this.worker.postMessage({});
    }
    stop() {
        this.worker.terminate();
    }
    onMessageHandler() {
        const handler = (event) => {
            const data = event.data;
            switch (data.name) {
                case 'ack':
                    this.emit(data.id);
                    break;
                case 'frame':
                    this.emit('frame', data.id, data.instructions);
                    break;
            }
        };
        return handler;
    }
    onErrorHandler() {
        const handler = (event) => {
            console.error(event);
        };
        return handler;
    }
}
exports.default = WaendWorker;
