"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const events_1 = require("events");
const Geometry_1 = require("./Geometry");
const util_1 = require("./util");
class Model extends events_1.EventEmitter {
    constructor(data) {
        super();
        this.data = data;
        this.id = data.id;
    }
    has(prop) {
        return (prop in this.data.properties);
    }
    get(key, def) {
        return util_1.pathKey(this.data.properties, key, def);
    }
    getData() {
        return JSON.parse(JSON.stringify(this.data.properties));
    }
    toJSON() {
        return JSON.stringify(this.data);
    }
    cloneData() {
        return JSON.parse(this.toJSON());
    }
    _updateData(data, silent) {
        const props = this.data.properties;
        const newProps = data.properties;
        const changedProps = [];
        const changedAttrs = [];
        const changedKeys = lodash_1.difference(Object.keys(props), Object.keys(newProps)).concat(lodash_1.difference(Object.keys(newProps), Object.keys(props)));
        Object.keys(props).forEach((k) => {
            const v = props[k];
            if (!lodash_1.isEqual(v, newProps[k])) {
                changedProps.push(k);
            }
        });
        Object.keys(this.data).forEach((k) => {
            if ('properties' !== k) {
                const v = this.data[k];
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
            changedProps.forEach((k) => {
                this.emit('set', k, data.properties[k]);
            }, this);
        }
    }
}
exports.Model = Model;
exports.default = Model;
class User extends Model {
    get type() { return 'user'; }
}
exports.User = User;
class Group extends Model {
    get type() { return 'group'; }
}
exports.Group = Group;
class Layer extends Model {
    get type() { return 'layer'; }
}
exports.Layer = Layer;
class GeoModel extends Model {
    get type() { return 'geometry'; }
    getGeometry() {
        const geom = this.data.geom;
        return (new Geometry_1.Geometry(geom));
    }
    getExtent() {
        const geom = this.data.geom;
        return (new Geometry_1.Geometry(geom)).getExtent();
    }
}
exports.GeoModel = GeoModel;
class Feature extends GeoModel {
    get type() { return 'feature'; }
    setGeometry(geom) {
        this.data.geom = geom;
    }
}
exports.Feature = Feature;
