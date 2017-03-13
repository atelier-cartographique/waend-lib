"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const turf_1 = require("@turf/turf");
const helpers_1 = require("@turf/helpers");
function copy(data) {
    return JSON.parse(JSON.stringify(data));
}
function geomToFeature(geom) {
    return {
        type: "Feature",
        geometry: geom,
        properties: {}
    };
}
;
class Geometry {
    constructor(data) {
        if (data instanceof Geometry) {
            this.geometry = copy(data.geometry);
        }
        else if ('geometry' in data) {
            this.geometry = copy(data.geometry);
        }
        else if ('type' in data) {
            this.geometry = copy(data);
        }
        else {
            throw (new Error('CanNotBuildGeometry'));
        }
    }
    clone() {
        return (new Geometry(this));
    }
    getType() {
        return this.geometry.type;
    }
    getCoordinates() {
        return copy(this.geometry.coordinates);
    }
    getExtent() {
        return (new Extent(turf_1.bbox(geomToFeature(this.geometry))));
    }
    toGeoJSON() {
        return copy(this.geometry);
    }
}
exports.Geometry = Geometry;
class Point extends Geometry {
    getCoordinates() {
        return copy(this.geometry.coordinates);
    }
}
exports.Point = Point;
class LineString extends Geometry {
    getCoordinates() {
        return copy(this.geometry.coordinates);
    }
    appendCoordinate(opt_point) {
        const p = new Point(opt_point);
        const geometry = this.geometry;
        const coords = p.getCoordinates();
        geometry.coordinates.push(coords);
    }
}
exports.LineString = LineString;
class Polygon extends Geometry {
    getCoordinates() {
        return copy(this.geometry.coordinates);
    }
}
exports.Polygon = Polygon;
class Extent {
    constructor(extent) {
        if (extent instanceof Extent) {
            this.extent = extent.getArray();
        }
        else if (extent instanceof Geometry) {
            this.extent = extent.getExtent().getArray();
        }
        else if (('top' in extent) && ('left' in extent)
            && ('right' in extent) && ('bottom' in extent)) {
            const e = extent;
            this.extent = [e.left, e.top, e.right, e.bottom];
        }
        else {
            this.extent = copy(extent);
        }
    }
    getArray() {
        return copy(this.extent);
    }
    getCoordinates() {
        return copy(this.extent);
    }
    getDictionary() {
        return {
            minX: this.extent[0],
            minY: this.extent[1],
            maxX: this.extent[2],
            maxY: this.extent[3]
        };
    }
    clone() {
        return (new Extent(this));
    }
    toPolygon() {
        return (new Polygon(turf_1.bboxPolygon(this.extent)));
    }
    normalize() {
        let tmp;
        if (this.extent[0] > this.extent[2]) {
            tmp = this.extent[0];
            this.extent[0] = this.extent[2];
            this.extent[2] = tmp;
        }
        if (this.extent[1] > this.extent[3]) {
            tmp = this.extent[1];
            this.extent[1] = this.extent[3];
            this.extent[3] = tmp;
        }
        return this;
    }
    intersects(v) {
        const r = v;
        const e = this.extent;
        if (2 === v.length) {
            r.push(v[0]);
            r.push(v[1]);
        }
        return (e[0] <= r[2]
            && r[0] <= e[2]
            && e[1] <= r[3]
            && r[1] <= e[3]);
    }
    add(extent) {
        extent = (extent instanceof Extent) ? extent : new Extent(extent);
        this.extent[0] = Math.min(this.extent[0], extent.extent[0]);
        this.extent[1] = Math.min(this.extent[1], extent.extent[1]);
        this.extent[2] = Math.max(this.extent[2], extent.extent[2]);
        this.extent[3] = Math.max(this.extent[3], extent.extent[3]);
        return this;
    }
    bound(optExtent) {
        const e = (new Extent(optExtent)).getCoordinates();
        const result = new Array(4);
        result[0] = Math.max(e[0], this.extent[0]);
        result[1] = Math.max(e[1], this.extent[1]);
        result[2] = Math.min(e[2], this.extent[2]);
        result[3] = Math.min(e[3], this.extent[3]);
        return (new Extent(result));
    }
    buffer(value) {
        const w = this.getWidth();
        const h = this.getHeight();
        const d = Math.sqrt((w * w) + (h * h));
        const dn = d + value;
        const wn = w * (dn / d);
        const hn = h * (dn / d);
        const c = this.getCenter().getCoordinates();
        this.extent = [
            c[0] - (wn / 2),
            c[1] - (hn / 2),
            c[0] + (wn / 2),
            c[1] + (hn / 2)
        ];
        return this;
    }
    maxSquare() {
        const w = this.getWidth();
        const h = this.getHeight();
        if (w < h) {
            const bw = (h - w) / 2;
            this.extent[0] -= bw;
            this.extent[2] += bw;
        }
        else if (h < w) {
            const bh = (w - h) / 2;
            this.extent[1] -= bh;
            this.extent[3] += bh;
        }
        return this;
    }
    minSquare() {
    }
    getHeight() {
        return Math.abs(this.extent[3] - this.extent[1]);
    }
    getWidth() {
        return Math.abs(this.extent[2] - this.extent[0]);
    }
    getBottomLeft() {
        const p = helpers_1.point([this.extent[0], this.extent[1]]);
        return (new Point(p));
    }
    getBottomRight() {
        const p = helpers_1.point([this.extent[2], this.extent[1]]);
        return (new Point(p));
    }
    getTopLeft() {
        const p = helpers_1.point([this.extent[0], this.extent[3]]);
        return (new Point(p));
    }
    getTopRight() {
        const p = helpers_1.point([this.extent[2], this.extent[3]]);
        return (new Point(p));
    }
    getCenter() {
        const p = helpers_1.point([
            (this.extent[0] + this.extent[2]) / 2,
            (this.extent[1] + this.extent[3]) / 2
        ]);
        return (new Point(p));
    }
    getSurface() {
        return this.getHeight() * this.getWidth();
    }
}
exports.Extent = Extent;
function toDMS(lat, lng) {
    let latD;
    let latM;
    let latS;
    let lngD;
    let lngM;
    let lngS;
    let latAbs;
    let lngAbs;
    let latAz;
    let lngAz;
    latAbs = Math.abs(lat);
    lngAbs = Math.abs(lng);
    latAz = (lat < 0) ? 'S' : 'N';
    lngAz = (lng < 0) ? 'W' : 'E';
    latD = Math.floor(latAbs);
    latM = Math.floor(60 * (latAbs - latD));
    latS = 3600 * (latAbs - latD - latM / 60);
    lngD = Math.floor(lngAbs);
    lngM = Math.floor(60 * (lngAbs - lngD));
    lngS = 3600 * (lngAbs - lngD - lngM / 60);
    return [
        `${latD}°`, `${latM}'`, `${latS.toPrecision(4)}'`, latAz,
        `${lngD}°`, `${lngM}'`, `${lngS.toPrecision(4)}'`, lngAz
    ].join(' ');
}
exports.toDMS = toDMS;
