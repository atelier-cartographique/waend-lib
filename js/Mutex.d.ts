/// <reference types="node" />
/// <reference types="bluebird" />
import * as Promise from 'bluebird';
import { EventEmitter } from 'events';
export declare type Unlock = () => void;
export declare class Mutex extends EventEmitter {
    private queueLength;
    private queue;
    constructor(queueLength?: number);
    get(): Promise<Unlock>;
}
