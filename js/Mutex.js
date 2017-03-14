"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const debug = require("debug");
const logger = debug('waend:Mutex');
class Mutex extends events_1.EventEmitter {
    constructor(queueLength = 128) {
        super();
        this.queueLength = queueLength;
        this.queue = 0;
        this.setMaxListeners(this.queueLength);
    }
    get() {
        logger('mutex.get', this.queue);
        const unlock = () => {
            logger('mutex.unlock', this.queue);
            this.queue -= 1;
            this.emit('unlock', this.queue);
        };
        if (this.queue > 0) {
            const resolver = (resolve, reject) => {
                if (this.queue >= this.queueLength) {
                    return reject(new Error('QueueLengthExceeded'));
                }
                const index = this.queue;
                this.queue += 1;
                logger('mutex.queue', this.queue);
                const listener = (q) => {
                    if (q <= index) {
                        this.removeListener('unlock', listener);
                        resolve(unlock);
                    }
                };
                this.on('unlock', listener);
            };
            return (new Promise(resolver));
        }
        this.queue += 1;
        return Promise.resolve(unlock);
    }
}
exports.Mutex = Mutex;
