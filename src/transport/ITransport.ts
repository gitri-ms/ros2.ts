import EventEmitter from "events";
import { Message } from "../Message";

export interface ITransport extends EventEmitter{
    connect();
    dispose();
    send(message: any);

    'connected': () => void;
    'disconnected': () => void;
    'onMessage': (msg: any) => void;
  }