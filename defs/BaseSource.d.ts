/// <reference types="node" />
/// <reference types="rbush" />
import { EventEmitter } from 'events';
import { Extent } from './Geometry';
import { GeoModel } from './Model';
export declare class BaseSource<T extends GeoModel> extends EventEmitter {
    private tree;
    private index;
    private features;
    constructor();
    clear(): void;
    addFeature(f: T, skipSpatialIndex?: boolean): void;
    removeFeature(id: string): void;
    buildTree(): void;
    getLength(): number;
    getFeature(id: string): T;
    getFeatures(opt_extent?: Extent | number[] | rbush.BBox): T[];
}
