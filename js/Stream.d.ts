/// <reference types="node" />
/// <reference types="bluebird" />
import { EventEmitter } from 'events';
import * as Promise from 'bluebird';
export declare enum Status {
    Open = 0,
    Close = 1,
}
export interface Span {
    text: string;
    fragment?: Element;
    commands?: string[];
}
export declare type SpanPack = Span[];
export declare type PackPage = SpanPack[];
export declare class Stream extends EventEmitter {
    private entries;
    private openStatus;
    constructor(status?: Status);
    open(): void;
    close(): void;
    isOpened(): boolean;
    write(pack: SpanPack): void;
    read(): Promise<SpanPack>;
    readSync(): Span[] | null | undefined;
    dump(): Span[][];
}
