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
var events_1 = require("events");
var debug = require("debug");
var log = debug('waend:Worker');
exports.EventRenderFrame = 'render:frame';
exports.EventCancelFrame = 'render:cancel';
exports.EventRenderInit = 'render:init';
exports.EventRenderUpdate = 'render:update';
var WaendWorker = (function (_super) {
    __extends(WaendWorker, _super);
    function WaendWorker(url) {
        var _this = _super.call(this) || this;
        _this.url = url;
        return _this;
    }
    WaendWorker.prototype.post = function (message) {
        log("send " + message.name);
        this.worker.postMessage(message);
    };
    WaendWorker.prototype.start = function () {
        this.worker = new Worker(this.url);
        this.worker.addEventListener('message', this.onMessageHandler(), false);
        this.worker.addEventListener('error', this.onErrorHandler(), false);
        this.worker.postMessage({});
    };
    WaendWorker.prototype.stop = function () {
        this.worker.terminate();
    };
    WaendWorker.prototype.onMessageHandler = function () {
        var _this = this;
        var handler = function (event) {
            var data = event.data;
            log("recv " + data.name + " (" + data.id + ")");
            switch (data.name) {
                case 'ack':
                    _this.emit(data.id);
                    break;
                case 'frame':
                    _this.emit('frame', data.id, data.instructions);
                    break;
            }
        };
        return handler;
    };
    WaendWorker.prototype.onErrorHandler = function () {
        var handler = function (event) {
            console.error(event);
        };
        return handler;
    };
    return WaendWorker;
}(events_1.EventEmitter));
exports.WaendWorker = WaendWorker;
