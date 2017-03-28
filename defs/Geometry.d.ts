/// <reference types="geojson" />
/// <reference types="rbush" />
import * as GeoJSON from 'geojson';
export declare type JSONGeometry = GeoJSON.Point | GeoJSON.LineString | GeoJSON.Polygon;
export declare type Coordinates = GeoJSON.Position | GeoJSON.Position[] | GeoJSON.Position[][];
export declare type CoordPoint = GeoJSON.Position;
export declare type CoordLinestring = GeoJSON.Position[];
export declare type CoordPolygon = GeoJSON.Position[][];
export interface IFeature {
    geometry: JSONGeometry;
}
export declare type GeomOpt = Geometry | IFeature | JSONGeometry;
export declare class Geometry {
    protected geometry: JSONGeometry;
    constructor(data: GeomOpt);
    clone(): Geometry;
    getType(): "Point" | "LineString" | "Polygon";
    getCoordinates(): Coordinates;
    getExtent(): Extent;
    toGeoJSON(): JSONGeometry;
}
export declare class Point extends Geometry {
    getCoordinates(): CoordPoint;
}
export declare class LineString extends Geometry {
    getCoordinates(): CoordLinestring;
    appendCoordinate(opt_point: GeomOpt): void;
}
export declare class Polygon extends Geometry {
    getCoordinates(): CoordPolygon;
}
export declare type Rect = {
    top: number;
    left: number;
    right: number;
    bottom: number;
};
export declare type ExtentOpt = Extent | Geometry | Rect | number[];
export declare class Extent {
    protected extent: Array<number>;
    constructor(extent: ExtentOpt);
    getArray(): number[];
    getCoordinates(): number[];
    getDictionary(): rbush.BBox;
    clone(): Extent;
    toPolygon(): Polygon;
    normalize(): this;
    intersects(v: number[]): boolean;
    add(extent: any): this;
    bound(optExtent: any): Extent;
    buffer(value: number): this;
    maxSquare(): this;
    minSquare(): void;
    getHeight(): number;
    getWidth(): number;
    getBottomLeft(): Point;
    getBottomRight(): Point;
    getTopLeft(): Point;
    getTopRight(): Point;
    getCenter(): Point;
    getSurface(): number;
}
export declare function toDMS(lat: number, lng: number): string;
