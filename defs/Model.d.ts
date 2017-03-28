/// <reference types="node" />
import { EventEmitter } from 'events';
import { GeomOpt, Geometry, JSONGeometry, Extent } from './Geometry';
export declare function pathKey(objOpt: any, pathOpt: string, def: any): any;
export interface ModelProperties {
    [propName: string]: any;
}
export interface BaseModelData {
    properties: ModelProperties;
    geom?: GeomOpt;
    [propName: string]: any;
}
export interface ModelData extends BaseModelData {
    id: string;
}
export declare class Model extends EventEmitter {
    protected data: ModelData;
    readonly id: string;
    constructor(data: ModelData);
    has(prop: string): boolean;
    get(key: string, def: any): any;
    getData(): ModelProperties;
    toJSON(): string;
    cloneData(): ModelData;
    _updateData(data: ModelData, silent: boolean): void;
}
export default Model;
export declare class User extends Model {
    readonly type: string;
}
export declare class Group extends Model {
    readonly type: string;
}
export declare class Layer extends Model {
    readonly type: string;
}
export declare class GeoModel extends Model {
    readonly type: string;
    getGeometry(): Geometry;
    getExtent(): Extent;
}
export declare class Feature extends GeoModel {
    readonly type: string;
    setGeometry(geom: JSONGeometry): void;
}
