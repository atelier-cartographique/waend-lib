/// <reference types="node" />
import { EventEmitter } from 'events';
import { ModelData } from "./Model";
import { PainterCommand } from "./index";
export declare const EventRenderFrame = "render:frame";
export interface MessageFrame {
    name: 'render:frame';
    id: string;
    extent: number[];
    transform: number[];
}
export declare const EventCancelFrame = "render:cancel";
export interface MessageCancel {
    name: 'render:cancel';
    id: string;
}
export declare const EventRenderInit = "render:init";
export interface MessageInit {
    name: 'render:init';
    models: ModelData[];
    ack: string;
}
export declare const EventRenderUpdate = "render:update";
export interface MessageUpdate {
    name: 'render:update';
    models: ModelData[];
    ack: string;
}
export declare type TypedMessage = MessageFrame | MessageCancel | MessageInit | MessageUpdate;
export interface ResponseAck {
    name: 'ack';
    id: string;
}
export interface ResponseFrame {
    name: 'frame';
    id: string;
    instructions: PainterCommand[];
}
export declare class WaendWorker extends EventEmitter {
    private url;
    private worker;
    constructor(url: string);
    post<T extends TypedMessage>(message: T): void;
    start(): void;
    stop(): void;
    onMessageHandler(): (event: MessageEvent) => void;
    onErrorHandler(): (event: ErrorEvent) => void;
}
