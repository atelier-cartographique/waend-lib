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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var rbush = require("rbush");
var events_1 = require("events");
var Geometry_1 = require("./Geometry");
var BaseSource = (function (_super) {
    __extends(BaseSource, _super);
    function BaseSource() {
        var _this = _super.call(this) || this;
        _this.tree = rbush();
        _this.index = {};
        _this.features = [];
        return _this;
    }
    BaseSource.prototype.clear = function () {
        this.index = {};
        this.features = [];
        this.tree.clear();
    };
    BaseSource.prototype.addFeature = function (f, skipSpatialIndex) {
        if (skipSpatialIndex === void 0) { skipSpatialIndex = false; }
        this.features.push(f);
        this.index[f.id] = this.features.length - 1;
        if (!skipSpatialIndex) {
            var geom = f.getGeometry();
            var baseExtent = geom.getExtent().getDictionary();
            var extent = __assign({ id: f.id }, baseExtent);
            this.tree.insert(extent);
        }
        this.emit('add', f);
    };
    BaseSource.prototype.removeFeature = function (id) {
        this.features.splice(this.index[id], 1);
        delete this.index[id];
        this.buildTree();
    };
    BaseSource.prototype.buildTree = function () {
        var features = this.features;
        var flen = features.length;
        var items = [];
        this.tree.clear();
        for (var i = 0; i < flen; i++) {
            var feature = features[i];
            items.push(__assign({ id: feature.id }, (feature.getExtent().getDictionary())));
        }
        this.tree.load(items);
    };
    BaseSource.prototype.getLength = function () {
        return this.features.length;
    };
    BaseSource.prototype.getFeature = function (id) {
        return this.features[this.index[id]];
    };
    BaseSource.prototype.getFeatures = function (opt_extent) {
        var features = [];
        if (opt_extent) {
            var extent = void 0;
            if (opt_extent instanceof Geometry_1.Extent) {
                extent = opt_extent.getDictionary();
            }
            else if (Array.isArray(opt_extent)) {
                extent = (new Geometry_1.Extent(opt_extent)).getDictionary();
            }
            else {
                extent = opt_extent;
            }
            var items = this.tree.search(extent);
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var featureIndex = this.index[item.id];
                features.push(this.features[featureIndex]);
            }
        }
        else {
            return this.features;
        }
        return features;
    };
    return BaseSource;
}(events_1.EventEmitter));
exports.BaseSource = BaseSource;
