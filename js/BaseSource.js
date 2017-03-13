"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rbush = require("rbush");
const events_1 = require("events");
const Geometry_1 = require("./Geometry");
class BaseSource extends events_1.EventEmitter {
    constructor() {
        super();
        this.tree = rbush();
        this.index = {};
        this.features = [];
    }
    clear() {
        this.index = {};
        this.features = [];
        this.tree.clear();
    }
    addFeature(f, skipSpatialIndex = false) {
        this.features.push(f);
        this.index[f.id] = this.features.length - 1;
        if (!skipSpatialIndex) {
            const geom = f.getGeometry();
            const extent = Object.assign({ id: f.id }, geom.getExtent().getDictionary());
            this.tree.insert(extent);
        }
        this.emit('add', f);
    }
    removeFeature(id) {
        this.features.splice(this.index[id], 1);
        delete this.index[id];
        this.buildTree();
    }
    buildTree() {
        const features = this.features;
        const flen = features.length;
        const items = [];
        this.tree.clear();
        for (let i = 0; i < flen; i++) {
            const feature = features[i];
            items.push(Object.assign({ id: feature.id }, (feature.getExtent().getDictionary())));
        }
        this.tree.load(items);
    }
    getLength() {
        return this.features.length;
    }
    getFeature(id) {
        return this.features[this.index[id]];
    }
    getFeatures(opt_extent) {
        const features = [];
        if (opt_extent) {
            let extent;
            if (opt_extent instanceof Geometry_1.Extent) {
                extent = opt_extent.getDictionary();
            }
            else if (Array.isArray(opt_extent)) {
                extent = (new Geometry_1.Extent(opt_extent)).getDictionary();
            }
            else {
                extent = opt_extent;
            }
            const items = this.tree.search(extent);
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const featureIndex = this.index[item.id];
                features.push(this.features[featureIndex]);
            }
        }
        else {
            return this.features;
        }
        return features;
    }
}
exports.default = BaseSource;
