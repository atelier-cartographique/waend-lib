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
var Promise = require("bluebird");
var Status;
(function (Status) {
    Status[Status["Open"] = 0] = "Open";
    Status[Status["Close"] = 1] = "Close";
})(Status = exports.Status || (exports.Status = {}));
var Stream = (function (_super) {
    __extends(Stream, _super);
    function Stream(status) {
        if (status === void 0) { status = Status.Open; }
        var _this = _super.call(this) || this;
        _this.entries = [];
        _this.openStatus = status;
        return _this;
    }
    Stream.prototype.open = function () {
        this.openStatus = Status.Open;
    };
    Stream.prototype.close = function () {
        this.openStatus = Status.Close;
    };
    Stream.prototype.isOpened = function () {
        return (this.openStatus === Status.Open);
    };
    Stream.prototype.write = function (pack) {
        if (this.isOpened()) {
            this.entries.push(pack);
            this.emit('data', pack);
        }
    };
    Stream.prototype.read = function () {
        var _this = this;
        if (this.isOpened) {
            var entry = this.entries.shift();
            if (entry) {
                return Promise.resolve(entry);
            }
            else {
                var resolver = function (resolve) {
                    _this.once('data', function (entry) {
                        resolve(entry);
                        _this.entries.shift();
                    });
                };
                return (new Promise(resolver));
            }
        }
        return Promise.reject(new Error('stream is closed'));
    };
    Stream.prototype.readSync = function () {
        if (this.isOpened()) {
            return this.entries.shift();
        }
        return null;
    };
    Stream.prototype.dump = function () {
        var entries = this.entries;
        this.entries = [];
        return entries;
    };
    return Stream;
}(events_1.EventEmitter));
exports.Stream = Stream;
;
