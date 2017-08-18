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
var turf_1 = require("@turf/turf");
var helpers_1 = require("@turf/helpers");
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
var Geometry = (function () {
    function Geometry(data) {
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
    Geometry.prototype.clone = function () {
        return (new Geometry(this));
    };
    Geometry.prototype.getType = function () {
        return this.geometry.type;
    };
    Geometry.prototype.getCoordinates = function () {
        return copy(this.geometry.coordinates);
    };
    Geometry.prototype.getExtent = function () {
        return (new Extent(turf_1.bbox(geomToFeature(this.geometry))));
    };
    Geometry.prototype.toGeoJSON = function () {
        return copy(this.geometry);
    };
    return Geometry;
}());
exports.Geometry = Geometry;
var Point = (function (_super) {
    __extends(Point, _super);
    function Point() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Point.prototype.getCoordinates = function () {
        return copy(this.geometry.coordinates);
    };
    return Point;
}(Geometry));
exports.Point = Point;
var LineString = (function (_super) {
    __extends(LineString, _super);
    function LineString() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LineString.prototype.getCoordinates = function () {
        return copy(this.geometry.coordinates);
    };
    LineString.prototype.appendCoordinate = function (opt_point) {
        var p = new Point(opt_point);
        var geometry = this.geometry;
        var coords = p.getCoordinates();
        geometry.coordinates.push(coords);
    };
    return LineString;
}(Geometry));
exports.LineString = LineString;
var Polygon = (function (_super) {
    __extends(Polygon, _super);
    function Polygon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Polygon.prototype.getCoordinates = function () {
        return copy(this.geometry.coordinates);
    };
    return Polygon;
}(Geometry));
exports.Polygon = Polygon;
var Extent = (function () {
    function Extent(extent) {
        if (extent instanceof Extent) {
            this.extent = extent.getArray();
        }
        else if (extent instanceof Geometry) {
            this.extent = extent.getExtent().getArray();
        }
        else if (('top' in extent) && ('left' in extent)
            && ('right' in extent) && ('bottom' in extent)) {
            var e = extent;
            this.extent = [e.left, e.top, e.right, e.bottom];
        }
        else {
            this.extent = copy(extent);
        }
    }
    Extent.prototype.getArray = function () {
        return copy(this.extent);
    };
    Extent.prototype.getCoordinates = function () {
        return copy(this.extent);
    };
    Extent.prototype.getDictionary = function () {
        return {
            minX: this.extent[0],
            minY: this.extent[1],
            maxX: this.extent[2],
            maxY: this.extent[3]
        };
    };
    Extent.prototype.clone = function () {
        return (new Extent(this));
    };
    Extent.prototype.toPolygon = function () {
        return (new Polygon(turf_1.bboxPolygon(this.extent)));
    };
    Extent.prototype.normalize = function () {
        var tmp;
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
    };
    Extent.prototype.intersects = function (v) {
        var r = v;
        var e = this.extent;
        if (2 === v.length) {
            r.push(v[0]);
            r.push(v[1]);
        }
        return (e[0] <= r[2]
            && r[0] <= e[2]
            && e[1] <= r[3]
            && r[1] <= e[3]);
    };
    Extent.prototype.add = function (extent) {
        extent = (extent instanceof Extent) ? extent : new Extent(extent);
        this.extent[0] = Math.min(this.extent[0], extent.extent[0]);
        this.extent[1] = Math.min(this.extent[1], extent.extent[1]);
        this.extent[2] = Math.max(this.extent[2], extent.extent[2]);
        this.extent[3] = Math.max(this.extent[3], extent.extent[3]);
        return this;
    };
    Extent.prototype.bound = function (optExtent) {
        var e = (new Extent(optExtent)).getCoordinates();
        var result = new Array(4);
        result[0] = Math.max(e[0], this.extent[0]);
        result[1] = Math.max(e[1], this.extent[1]);
        result[2] = Math.min(e[2], this.extent[2]);
        result[3] = Math.min(e[3], this.extent[3]);
        return (new Extent(result));
    };
    Extent.prototype.buffer = function (value) {
        var w = this.getWidth();
        var h = this.getHeight();
        var d = Math.sqrt((w * w) + (h * h));
        var dn = d + value;
        var wn = w * (dn / d);
        var hn = h * (dn / d);
        var c = this.getCenter().getCoordinates();
        this.extent = [
            c[0] - (wn / 2),
            c[1] - (hn / 2),
            c[0] + (wn / 2),
            c[1] + (hn / 2)
        ];
        return this;
    };
    Extent.prototype.maxSquare = function () {
        var w = this.getWidth();
        var h = this.getHeight();
        if (w < h) {
            var bw = (h - w) / 2;
            this.extent[0] -= bw;
            this.extent[2] += bw;
        }
        else if (h < w) {
            var bh = (w - h) / 2;
            this.extent[1] -= bh;
            this.extent[3] += bh;
        }
        return this;
    };
    Extent.prototype.minSquare = function () {
    };
    Extent.prototype.getHeight = function () {
        return Math.abs(this.extent[3] - this.extent[1]);
    };
    Extent.prototype.getWidth = function () {
        return Math.abs(this.extent[2] - this.extent[0]);
    };
    Extent.prototype.getBottomLeft = function () {
        var p = helpers_1.point([this.extent[0], this.extent[1]]);
        return (new Point(p));
    };
    Extent.prototype.getBottomRight = function () {
        var p = helpers_1.point([this.extent[2], this.extent[1]]);
        return (new Point(p));
    };
    Extent.prototype.getTopLeft = function () {
        var p = helpers_1.point([this.extent[0], this.extent[3]]);
        return (new Point(p));
    };
    Extent.prototype.getTopRight = function () {
        var p = helpers_1.point([this.extent[2], this.extent[3]]);
        return (new Point(p));
    };
    Extent.prototype.getCenter = function () {
        var p = helpers_1.point([
            (this.extent[0] + this.extent[2]) / 2,
            (this.extent[1] + this.extent[3]) / 2
        ]);
        return (new Point(p));
    };
    Extent.prototype.getSurface = function () {
        return this.getHeight() * this.getWidth();
    };
    return Extent;
}());
exports.Extent = Extent;
function toDMS(lat, lng) {
    var latD;
    var latM;
    var latS;
    var lngD;
    var lngM;
    var lngS;
    var latAbs;
    var lngAbs;
    var latAz;
    var lngAz;
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
        latD + "\u00B0", latM + "'", latS.toPrecision(4) + "'", latAz,
        lngD + "\u00B0", lngM + "'", lngS.toPrecision(4) + "'", lngAz
    ].join(' ');
}
exports.toDMS = toDMS;
