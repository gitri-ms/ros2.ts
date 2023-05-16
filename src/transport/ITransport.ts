import EventEmitter from "events";
import { Message } from "../std_msgs/Message";

export interface ITransport extends EventEmitter{
    connect();
    disconnect();
    dispose();
    send(message: any);

    'connected': () => void;
    'disconnected': () => void;
    'onMessage': (msg: any) => void;
  }