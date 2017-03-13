/*
 * app/lib/Model.js
 *
 *
 * Copyright (C) 2015  Pierre Marchand <pierremarc07@gmail.com>
 *
 * License in LICENSE file at the root of the repository.
 *
 */


import { difference, isEqual } from 'lodash';
import { EventEmitter } from 'events';
import { GeomOpt, Geometry, JSONGeometry, Extent } from './Geometry';
// import * as debug from 'debug';
import { pathKey } from "./util";
// const logger = debug('waend:Model');


// TODO spec params and style interfaces

export interface ModelProperties {
    [propName: string]: any;
}

export interface BaseModelData {
    properties: ModelProperties;
    geom?: GeomOpt;
    [propName: string]: any;
}

export interface ModelData extends BaseModelData {
    id: string,
}




export class Model extends EventEmitter {
    readonly id: string;

    constructor(protected data: ModelData) {
        super();
        this.id = data.id;
    }

    has(prop: string) {
        return (prop in this.data.properties);
    }

    get(key: string, def: any): any {
        return pathKey(this.data.properties, key, def);
    }

    getData(): ModelProperties {
        return JSON.parse(JSON.stringify(this.data.properties));
    }

    // setData(data: ModelProperties) {
    //     this.data.properties = data;
    //     this.emit('set:data', data);
    //     return getBinder().update(this);
    // }

    toJSON() {
        return JSON.stringify(this.data);
    }

    cloneData(): ModelData {
        return JSON.parse(this.toJSON());
    }

    _updateData(data: ModelData, silent: boolean) {
        const props = this.data.properties;
        const newProps = data.properties;
        const changedProps: string[] = [];
        const changedAttrs: string[] = [];
        const changedKeys = difference(Object.keys(props), Object.keys(newProps)).concat(difference(Object.keys(newProps), Object.keys(props)));

        Object.keys(props).forEach((k) => {
            const v = props[k];
            if (!isEqual(v, newProps[k])) {
                changedProps.push(k);
            }
        });

        Object.keys(this.data).forEach((k) => {
            if ('properties' !== k) {
                const v = this.data[k];
                if (!isEqual(v, data[k])) {
                    changedAttrs.push(k);
                }
            }
        });


        this.data = data;
        if (!silent
            && ((changedAttrs.length > 0)
                || (changedProps.length > 0)
                || (changedKeys.length > 0))) {
            this.emit('set:data', data);

            changedProps.forEach((k) => {
                this.emit('set', k, data.properties[k]);
            }, this);
        }
    }

}


export default Model;

// models

export class User extends Model {
    get type() { return 'user'; }
}

export class Group extends Model {
    get type() { return 'group'; }
}


export class Layer extends Model {
    get type() { return 'layer'; }

    // getGroup() {
    //     const path = this.getPath();
    //     return getBinder().getGroup(path[0], path[1]);
    // }

    // isVisible() {
    //     const resolver = (yes: () => void, no: () => void) => {
    //         this.getGroup()
    //             .then(group => {
    //                 const visibleList = group.get('params.visible', null);
    //                 if (null === visibleList) {
    //                     return yes();
    //                 }
    //                 if (visibleList.indexOf(this.id) < 0) {
    //                     return no();
    //                 }
    //                 yes();
    //             })
    //             .catch(no);
    //     };
    //     return (new Promise(resolver));
    // }
}

export class GeoModel extends Model {
    get type() { return 'geometry'; }

    getGeometry() {
        const geom = <GeomOpt>this.data.geom;
        return (new Geometry(geom));
    }

    getExtent(): Extent {
        const geom = <GeomOpt>this.data.geom;
        return (new Geometry(geom)).getExtent();
    }
}

export class Feature extends GeoModel {
    get type() { return 'feature'; }

    setGeometry(geom: JSONGeometry) {
        this.data.geom = geom;
    }
}

