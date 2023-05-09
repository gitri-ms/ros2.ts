import { Message } from "../Message";

export interface ITransport {
    connect();
    dispose();
    send(message: any);

    'connected': () => void;
    'disconnected': () => void;
    'onMessage': (msg: any) => void;
  }