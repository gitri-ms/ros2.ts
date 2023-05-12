import { ITransport } from "../src/transport/ITransport";

export class LoopbackTransport implements ITransport {
  public onMessage: (msg: any) => void = (msg: any) => {};
  public on = <K extends keyof ITransport>(event: K, listener: ITransport[K]): this => this.on(event, listener)
  public emit = <K extends keyof ITransport>(event: K, ...args: Parameters<ITransport[K]>): boolean => this.emit(event, ...args)
  'connected': () => void;
  'disconnected': () => void;

  public constructor() {
  }

  public connect() {
  }

  public send(message: any) {
    this.onMessage(message);
  }

  public close() {
  }

  public dispose() {
  }
}