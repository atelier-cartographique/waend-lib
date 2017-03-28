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
var lodash_1 = require("lodash");
var events_1 = require("events");
var Geometry_1 = require("./Geometry");
function pathKey(objOpt, pathOpt, def) {
    var path = pathOpt.split('.');
    var obj = objOpt;
    for (var i = 0, len = path.length; i < len; i++) {
        if (!obj || (typeof obj !== 'object')) {
            return def;
        }
        var p = path[i];
        obj = obj[p];
    }
    if (obj === undefined) {
        return def;
    }
    return obj;
}
exports.pathKey = pathKey;
var Model = (function (_super) {
    __extends(Model, _super);
    function Model(data) {
        var _this = _super.call(this) || this;
        _this.data = data;
        _this.id = data.id;
        return _this;
    }
    Model.prototype.has = function (prop) {
        return (prop in this.data.properties);
    };
    Model.prototype.get = function (key, def) {
        return pathKey(this.data.properties, key, def);
    };
    Model.prototype.getData = function () {
        return JSON.parse(JSON.stringify(this.data.properties));
    };
    Model.prototype.toJSON = function () {
        return JSON.stringify(this.data);
    };
    Model.prototype.cloneData = function () {
        return JSON.parse(this.toJSON());
    };
    Model.prototype._updateData = function (data, silent) {
        var _this = this;
        var props = this.data.properties;
        var newProps = data.properties;
        var changedProps = [];
        var changedAttrs = [];
        var changedKeys = lodash_1.difference(Object.keys(props), Object.keys(newProps)).concat(lodash_1.difference(Object.keys(newProps), Object.keys(props)));
        Object.keys(props).forEach(function (k) {
            var v = props[k];
            if (!lodash_1.isEqual(v, newProps[k])) {
                changedProps.push(k);
            }
        });
        Object.keys(this.data).forEach(function (k) {
            if ('properties' !== k) {
                var v = _this.data[k];
                if (!lodash_1.isEqual(v, data[k])) {
                    changedAttrs.push(k);
                }
            }
        });
        this.data = data;
        if (!silent
            && ((changedAttrs.length > 0)
                || (changedProps.length > 0)
                || (changedKeys.length > 0))) {
            this.emit('set:data', data);
            changedProps.forEach(function (k) {
                _this.emit('set', k, data.properties[k]);
            }, this);
        }
    };
    return Model;
}(events_1.EventEmitter));
exports.Model = Model;
exports.default = Model;
var User = (function (_super) {
    __extends(User, _super);
    function User() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(User.prototype, "type", {
        get: function () { return 'user'; },
        enumerable: true,
        configurable: true
    });
    return User;
}(Model));
exports.User = User;
var Group = (function (_super) {
    __extends(Group, _super);
    function Group() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Group.prototype, "type", {
        get: function () { return 'group'; },
        enumerable: true,
        configurable: true
    });
    return Group;
}(Model));
exports.Group = Group;
var Layer = (function (_super) {
    __extends(Layer, _super);
    function Layer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Layer.prototype, "type", {
        get: function () { return 'layer'; },
        enumerable: true,
        configurable: true
    });
    return Layer;
}(Model));
exports.Layer = Layer;
var GeoModel = (function (_super) {
    __extends(GeoModel, _super);
    function GeoModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(GeoModel.prototype, "type", {
        get: function () { return 'geometry'; },
        enumerable: true,
        configurable: true
    });
    GeoModel.prototype.getGeometry = function () {
        var geom = this.data.geom;
        return (new Geometry_1.Geometry(geom));
    };
    GeoModel.prototype.getExtent = function () {
        var geom = this.data.geom;
        return (new Geometry_1.Geometry(geom)).getExtent();
    };
    return GeoModel;
}(Model));
exports.GeoModel = GeoModel;
var Feature = (function (_super) {
    __extends(Feature, _super);
    function Feature() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Feature.prototype, "type", {
        get: function () { return 'feature'; },
        enumerable: true,
        configurable: true
    });
    Feature.prototype.setGeometry = function (geom) {
        this.data.geom = geom;
    };
    return Feature;
}(GeoModel));
exports.Feature = Feature;
