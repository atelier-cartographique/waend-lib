/// <reference types="node" />
import { EventEmitter } from 'events';
export declare type Unlock = () => void;
export default class Mutex extends EventEmitter {
    private queueLength;
    private queue;
    constructor(queueLength?: number);
    get(): Promise<Unlock>;
}
