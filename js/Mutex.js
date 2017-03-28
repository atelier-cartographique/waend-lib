"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = require("bluebird");
var events_1 = require("events");
var debug = require("debug");
var logger = debug('waend:Mutex');
var Mutex = (function (_super) {
    __extends(Mutex, _super);
    function Mutex(queueLength) {
        if (queueLength === void 0) { queueLength = 128; }
        var _this = _super.call(this) || this;
        _this.queueLength = queueLength;
        _this.queue = 0;
        _this.setMaxListeners(_this.queueLength);
        return _this;
    }
    Mutex.prototype.get = function () {
        var _this = this;
        logger('mutex.get', this.queue);
        var unlock = function () {
            logger('mutex.unlock', _this.queue);
            _this.queue -= 1;
            _this.emit('unlock', _this.queue);
        };
        if (this.queue > 0) {
            var resolver = function (resolve, reject) {
                if (_this.queue >= _this.queueLength) {
                    return reject(new Error('QueueLengthExceeded'));
                }
                var index = _this.queue;
                _this.queue += 1;
                logger('mutex.queue', _this.queue);
                var listener = function (q) {
                    if (q <= index) {
                        _this.removeListener('unlock', listener);
                        resolve(unlock);
                    }
                };
                _this.on('unlock', listener);
            };
            return (new Promise(resolver));
        }
        this.queue += 1;
        return Promise.resolve(unlock);
    };
    return Mutex;
}(events_1.EventEmitter));
exports.Mutex = Mutex;
