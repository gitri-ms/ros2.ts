import EventEmitter from "events";
import { ITransport } from "../src/transport/ITransport";

export class LoopbackTransport extends EventEmitter implements ITransport {
  public onMessage: (msg: any) => void = (msg: any) => {};
  'connected': () => void;
  'disconnected': () => void;

  public constructor() {
    super();
  }

  public connect() {
    this.emit("connected");
  }

  public send(message: any) {
    this.onMessage(message);
  }

  public close() {
  }

  public dispose() {
  }
}