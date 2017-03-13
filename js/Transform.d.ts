/// <reference types="gl-matrix" />
import { mat3, vec2 } from 'gl-matrix';
export declare class Matrix {
    private m;
    constructor(a?: number | Matrix | number[], b?: number, c?: number, d?: number, e?: number, f?: number);
    readonly mat: mat3;
    readonly matRef: mat3;
    clone(): Matrix;
    parseFlat(a: number, b: number, c: number, d: number, e: number, f: number): void;
    flat(): number[];
    mul(o: Matrix): this;
    inverse(): Matrix;
}
export declare class Transform {
    private m;
    static fromFlatMatrix(fm: number[]): Transform;
    constructor(t?: Transform);
    flatMatrix(): number[];
    toString(): string;
    reset(t: Transform): Transform;
    clone(): Transform;
    inverse(): Transform;
    multiply(t: Transform | Matrix): Transform;
    translate(tx: number, ty: number): Transform;
    scale(sx: number, sy: number, origin: number[]): this;
    rotate(r: number, origin: number[]): this;
    getScale(): number[];
    getTranslate(): number[];
    mapVec2<T extends (vec2 | number[])>(v: T): T;
    mapVec2Fn(name?: string): <T extends number[] | vec2>(v: T) => T;
}
