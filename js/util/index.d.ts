/// <reference types="gl-matrix" />
/// <reference types="proj4" />
import { InterfaceProjection } from "proj4";
import { vec2 } from 'gl-matrix';
import Transform from '../Transform';
import { Model } from "../Model";
export declare function getModelName(model: Model): string;
export declare function copy<T>(data: T): T;
export declare function pathKey(objOpt: any, pathOpt: string, def: any): any;
export declare function isZero(val: number): boolean;
export declare function vecDist<T extends (vec2 | number[])>(v1: T, v2: T): number;
export declare function vecAdd<T extends (vec2 | number[])>(v1: T, v2: T, a: number): [number, number];
export declare function vecEquals(v1: number[], v2: number[]): boolean;
export declare function lineAngle<T extends (vec2 | number[])>(start: T, end: T): number;
export declare function transformExtent(extent: number[], T: Transform): number[];
export declare const polygonTransform: (T: Transform, coordinates: number[][][]) => number[][][];
export declare const lineTransform: (T: Transform, coordinates: number[][]) => number[][];
export declare const polygonFloor: (coordinates: number[][][]) => number[][][];
export declare const lineFloor: (coordinates: number[][]) => number[][];
export declare const Proj3857: InterfaceProjection;
export declare function projectExtent(extent: number[], proj?: InterfaceProjection): number[];
export declare function unprojectExtent(extent: number[], proj?: InterfaceProjection): number[];
export declare const polygonProject: (coordinates: number[][][]) => number[][][];
export declare const lineProject: (coordinates: number[][]) => number[][];
