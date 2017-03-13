"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const proj4_1 = require("proj4");
const gl_matrix_1 = require("gl-matrix");
function getModelName(model) {
    const name = model.get('name', null);
    if (name) {
        return JSON.stringify(name);
    }
    return `•${model.id.substr(0, 6)}`;
}
exports.getModelName = getModelName;
function copy(data) {
    return JSON.parse(JSON.stringify(data));
}
exports.copy = copy;
function pathKey(objOpt, pathOpt, def) {
    const path = pathOpt.split('.');
    let obj = objOpt;
    for (let i = 0, len = path.length; i < len; i++) {
        if (!obj || (typeof obj !== 'object')) {
            return def;
        }
        const p = path[i];
        obj = obj[p];
    }
    if (obj === undefined) {
        return def;
    }
    return obj;
}
exports.pathKey = pathKey;
function isZero(val) {
    return Math.abs(val) <= Number.EPSILON;
}
exports.isZero = isZero;
function vecDist(v1, v2) {
    const dx = v2[0] - v1[0];
    const dy = v2[1] - v1[1];
    return Math.sqrt((dx * dx) + (dy * dy));
}
exports.vecDist = vecDist;
function vecAdd(v1, v2, a) {
    const t = a / vecDist(v1, v2);
    const rx = v1[0] + (v2[0] - v1[0]) * t;
    const ry = v1[1] + (v2[1] - v1[1]) * t;
    return [rx, ry];
}
exports.vecAdd = vecAdd;
function vecEquals(v1, v2) {
    return (vecDist(v1, v2) < Number.EPSILON);
}
exports.vecEquals = vecEquals;
function lineAngle(start, end) {
    const d = [end[0] - start[0], end[1] - start[1]];
    const theta = Math.atan2(-d[1], d[0]) * 360.0 / 6.2831853071795;
    const theta_normalized = theta < 0 ? theta + 360 : theta;
    if (theta_normalized > 360) {
        return 0;
    }
    return theta_normalized;
}
exports.lineAngle = lineAngle;
function transformExtent(extent, T) {
    const min = extent.slice(0, 2);
    const max = extent.slice(2);
    T.mapVec2(gl_matrix_1.vec2.clone(min));
    T.mapVec2(gl_matrix_1.vec2.clone(max));
    return min.concat(max);
}
exports.transformExtent = transformExtent;
function floorVec2(v) {
    v[0] = Math.floor(v[0]);
    v[1] = Math.floor(v[1]);
    return v;
}
exports.polygonTransform = (T, coordinates) => {
    for (let i = 0; i < coordinates.length; i++) {
        const ringLength = coordinates[i].length;
        for (let ii = 0; ii < ringLength; ii++) {
            coordinates[i][ii] = T.mapVec2(coordinates[i][ii]);
        }
    }
    return coordinates;
};
exports.lineTransform = (T, coordinates) => {
    for (let i = 0; i < coordinates.length; i++) {
        coordinates[i] = T.mapVec2(coordinates[i]);
    }
    return coordinates;
};
exports.polygonFloor = (coordinates) => {
    for (let i = 0; i < coordinates.length; i++) {
        const ringLength = coordinates[i].length;
        for (let ii = 0; ii < ringLength; ii++) {
            coordinates[i][ii] = floorVec2(coordinates[i][ii]);
        }
    }
    return coordinates;
};
exports.lineFloor = (coordinates) => {
    for (let i = 0; i < coordinates.length; i++) {
        coordinates[i] = floorVec2(coordinates[i]);
    }
    return coordinates;
};
exports.Proj3857 = proj4_1.Proj('EPSG:3857');
function projectExtent(extent, proj = exports.Proj3857) {
    const min = proj.forward(extent.slice(0, 2));
    const max = proj.forward(extent.slice(2));
    return min.concat(max);
}
exports.projectExtent = projectExtent;
function unprojectExtent(extent, proj = exports.Proj3857) {
    const min = proj.inverse(extent.slice(0, 2));
    const max = proj.inverse(extent.slice(2));
    return min.concat(max);
}
exports.unprojectExtent = unprojectExtent;
exports.polygonProject = (coordinates) => {
    for (let i = 0; i < coordinates.length; i++) {
        const ringLength = coordinates[i].length;
        for (let ii = 0; ii < ringLength; ii++) {
            coordinates[i][ii] = exports.Proj3857.forward(coordinates[i][ii]);
        }
    }
    return coordinates;
};
exports.lineProject = (coordinates) => {
    for (let i = 0; i < coordinates.length; i++) {
        coordinates[i] = exports.Proj3857.forward(coordinates[i]);
    }
    return coordinates;
};
