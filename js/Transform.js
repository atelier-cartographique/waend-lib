"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gl_matrix_1 = require("gl-matrix");
var Matrix = (function () {
    function Matrix(a, b, c, d, e, f) {
        if (0 === arguments.length) {
            this.m = gl_matrix_1.mat3.create();
        }
        else if (1 === arguments.length) {
            if (a instanceof Matrix) {
                Matrix.prototype.parseFlat.apply(this, a.flat());
            }
            else if (Array.isArray(a)) {
                Matrix.prototype.parseFlat.apply(this, a);
            }
        }
        else if (6 === arguments.length) {
            this.parseFlat(a, b, c, d, e, f);
        }
    }
    Object.defineProperty(Matrix.prototype, "mat", {
        get: function () {
            return gl_matrix_1.mat3.clone(this.m);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "matRef", {
        get: function () {
            return this.m;
        },
        enumerable: true,
        configurable: true
    });
    Matrix.prototype.clone = function () {
        var mx = new Matrix();
        mx.m = gl_matrix_1.mat3.clone(this.m);
        return mx;
    };
    Matrix.prototype.parseFlat = function (a, b, c, d, e, f) {
        this.m = gl_matrix_1.mat3.fromValues(a, b, 0, c, d, 0, e, f, 1);
    };
    Matrix.prototype.flat = function () {
        var fm = new Array(6);
        fm[0] = this.m[0];
        fm[1] = this.m[1];
        fm[2] = this.m[3];
        fm[3] = this.m[4];
        fm[4] = this.m[6];
        fm[5] = this.m[7];
        return fm;
    };
    Matrix.prototype.mul = function (o) {
        gl_matrix_1.mat3.multiply(this.m, this.m, o.m);
        return this;
    };
    Matrix.prototype.inverse = function () {
        var inverse = new Matrix();
        gl_matrix_1.mat3.invert(inverse.m, this.m);
        return inverse;
    };
    return Matrix;
}());
exports.Matrix = Matrix;
var Transform = (function () {
    function Transform(t) {
        if (t) {
            this.m = t.m.clone();
        }
        else {
            this.m = new Matrix();
        }
    }
    Transform.fromFlatMatrix = function (fm) {
        var t = new Transform();
        t.m = new Matrix(fm);
        return t;
    };
    Transform.prototype.flatMatrix = function () {
        return this.m.flat();
    };
    Transform.prototype.toString = function () {
        function decimalAdjust(type, value, exp) {
            if (typeof exp === 'undefined' || +exp === 0) {
                return Math[type](value);
            }
            value = +value;
            exp = +exp;
            if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
                return NaN;
            }
            value = value.toString().split('e');
            value = Math[type](+(value[0] + "e" + (value[1] ? (+value[1] - exp) : -exp)));
            value = value.toString().split('e');
            return +(value[0] + "e" + (value[1] ? (+value[1] + exp) : exp));
        }
        function adjust(type, a, exp) {
            for (var i = 0; i < a.length; i++) {
                a[i] = decimalAdjust(type, a[i], exp);
            }
            return a;
        }
        var f = adjust('round', this.m.flat(), -5);
        var s = "<Matrix: (" + f.join(', ') + ")>";
        return s;
    };
    Transform.prototype.reset = function (t) {
        this.m = t.m.clone();
        return this;
    };
    Transform.prototype.clone = function () {
        var t = new Transform();
        this.reset.call(t, this);
        return t;
    };
    Transform.prototype.inverse = function () {
        var inverse_m = this.m.inverse();
        var inverse = new Transform();
        inverse.m = inverse_m;
        return inverse;
    };
    Transform.prototype.multiply = function (t) {
        if (t instanceof Matrix) {
            this.m.mul(t);
        }
        else {
            this.m.mul(t.m);
        }
        return this;
    };
    Transform.prototype.translate = function (tx, ty) {
        gl_matrix_1.mat3.translate(this.m.matRef, this.m.mat, [tx, ty]);
        return this;
    };
    Transform.prototype.scale = function (sx, sy, origin) {
        var sm = new Matrix();
        if (undefined !== origin) {
            gl_matrix_1.mat3.translate(sm.matRef, sm.mat, [origin[0], origin[1]]);
            gl_matrix_1.mat3.scale(sm.matRef, sm.mat, [sx, sy]);
            gl_matrix_1.mat3.translate(sm.matRef, sm.mat, [-origin[0], -origin[1]]);
        }
        else {
            gl_matrix_1.mat3.scale(sm.matRef, sm.mat, [sx, sy]);
        }
        this.m.mul(sm);
        return this;
    };
    Transform.prototype.rotate = function (r, origin) {
        var rGrad = r * Math.PI / 180.0;
        var rm = new Matrix();
        if (undefined !== origin) {
            gl_matrix_1.mat3.translate(rm.matRef, rm.mat, [origin[0], origin[1]]);
            gl_matrix_1.mat3.rotate(rm.matRef, rm.mat, rGrad);
            gl_matrix_1.mat3.translate(rm.matRef, rm.mat, [-origin[0], -origin[1]]);
        }
        else {
            gl_matrix_1.mat3.rotate(rm.matRef, rm.mat, rGrad);
        }
        this.m.mul(rm);
        return this;
    };
    Transform.prototype.getScale = function () {
        return [this.m.mat[0], this.m.mat[4]];
    };
    Transform.prototype.getTranslate = function () {
        return [this.m.mat[6], this.m.mat[7]];
    };
    Transform.prototype.mapVec2 = function (v) {
        var out = gl_matrix_1.vec2.create();
        gl_matrix_1.vec2.transformMat3(out, v, this.m.mat);
        v[0] = out[0];
        v[1] = out[1];
        return v;
    };
    Transform.prototype.mapVec2Fn = function (name) {
        var m = this.m.clone();
        var f = function (v) {
            var out = gl_matrix_1.vec2.create();
            gl_matrix_1.vec2.transformMat3(out, v, m.mat);
            v[0] = out[0];
            v[1] = out[1];
            return v;
        };
        if (name) {
            try {
                Object.defineProperty(f, 'name', { value: name });
            }
            catch (e) { }
        }
        return f;
    };
    return Transform;
}());
exports.Transform = Transform;
