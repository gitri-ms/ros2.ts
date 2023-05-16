import EventEmitter from "events";
import { ITransport } from "../src/transport/ITransport";
import { plainToClass } from 'class-transformer';
import { BridgeMessage } from "../src/BridgeMessage";
 
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
  public disconnect() {
    this.emit("disconnected");
  }

  public send(message: any) {
    this.emit("onMessage", message);
  }

  public close() {
  }

  public dispose() {
  }
}