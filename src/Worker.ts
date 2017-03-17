
import { EventEmitter } from 'events';
import { ModelData } from "./Model";
import { PainterCommand } from "./index";
import * as debug from 'debug';

const log = debug('waend:Worker');

export const EventRenderFrame = 'render:frame';
export interface MessageFrame {
    name: 'render:frame';
    id: string;
    extent: number[];
    transform: number[];
}

export const EventRenderInit = 'render:init';
export interface MessageInit {
    name: 'render:init';
    models: ModelData[];
    ack: string;
}

export const EventRenderUpdate = 'render:update';
export interface MessageUpdate {
    name: 'render:update';
    models: ModelData[];
    ack: string;
}

export type TypedMessage = MessageFrame | MessageInit | MessageUpdate;

export interface ResponseAck {
    name: 'ack',
    id: string;
}

export interface ResponseFrame {
    name: 'frame',
    id: string;
    instructions: PainterCommand[];
}

type Response = ResponseAck | ResponseFrame;


export class WaendWorker extends EventEmitter {
    private worker: Worker;


    constructor(private url: string) {
        super();
    }


    post<T extends TypedMessage>(message: T) {
        log(`send ${message.name}`);
        this.worker.postMessage(message);
    }


    start() {
        this.worker = new Worker(this.url);
        this.worker.addEventListener('message', this.onMessageHandler(), false);
        this.worker.addEventListener('error', this.onErrorHandler(), false);
        this.worker.postMessage({});
    }


    stop() {
        this.worker.terminate();
    }


    onMessageHandler() {
        const handler = (event: MessageEvent) => {
            const data = <Response>event.data;
            log(`recv ${data.name} (${data.id})`);

            switch (data.name) {
                case 'ack':
                    // emitting id allows for simple worker.once(id)
                    this.emit(data.id)
                    break;

                case 'frame':
                    this.emit('frame', data.id, data.instructions);
                    break;
            }
        };

        return handler;
    }


    onErrorHandler() {
        const handler = (event: ErrorEvent) => {
            console.error(event);
        };

        return handler;
    }
}

