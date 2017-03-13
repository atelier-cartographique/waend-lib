"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const Promise = require("bluebird");
var Status;
(function (Status) {
    Status[Status["Open"] = 0] = "Open";
    Status[Status["Close"] = 1] = "Close";
})(Status = exports.Status || (exports.Status = {}));
class Stream extends events_1.EventEmitter {
    constructor(status = Status.Open) {
        super();
        this.entries = [];
        this.openStatus = status;
    }
    open() {
        this.openStatus = Status.Open;
    }
    close() {
        this.openStatus = Status.Close;
    }
    isOpened() {
        return (this.openStatus === Status.Open);
    }
    write(pack) {
        if (this.isOpened()) {
            this.entries.push(pack);
            this.emit('data', pack);
        }
    }
    read() {
        if (this.isOpened) {
            const entry = this.entries.shift();
            if (entry) {
                return Promise.resolve(entry);
            }
            else {
                const resolver = (resolve) => {
                    this.once('data', (entry) => {
                        resolve(entry);
                        this.entries.shift();
                    });
                };
                return (new Promise(resolver));
            }
        }
        return Promise.reject(new Error('stream is closed'));
    }
    readSync() {
        if (this.isOpened()) {
            return this.entries.shift();
        }
        return null;
    }
    dump() {
        const entries = this.entries;
        this.entries = [];
        return entries;
    }
}
exports.Stream = Stream;
;
