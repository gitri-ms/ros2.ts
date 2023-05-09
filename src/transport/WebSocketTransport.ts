import EventEmitter from "events";
import {w3cwebsocket } from "websocket"
import http = require('http');
import CBOR from "cbor"
import { BSON } from "bson";
import { ITransport } from "./ITransport";

export class WebSocketTransport extends EventEmitter implements ITransport {
  public wsConnection : w3cwebsocket | undefined = undefined;
  public url : string = "";
  private _untypedOn = this.on
  private _untypedEmit = this.emit
  public on = <K extends keyof ITransport>(event: K, listener: ITransport[K]): this => this._untypedOn(event, listener)
  public emit = <K extends keyof ITransport>(event: K, ...args: Parameters<ITransport[K]>): boolean => this._untypedEmit(event, ...args)
  'connected': () => void;
  'disconnected': () => void;
  'onMessage': (msg: any) => void;

  public constructor(url: string) {
    super();

    this.url = url;
  }

  public connect() {
    this.wsConnection = new w3cwebsocket(this.url, "rosbridge-protocol");

    this.wsConnection.onopen = () => {
      this.emit("connected");
    }

    this.wsConnection.onclose = () => {
      this.emit("disconnected");
    }

    this.wsConnection.onmessage = (message) => {
      if (message.data instanceof ArrayBuffer) {
        var decoded = CBOR.decode(message.data);
        this.emit("onMessage", decoded);
      } else if (message.data instanceof String) {
        var decoded = JSON.parse(message.data as string);
        this.emit("onMessage", decoded);
      } else if (message.data instanceof Blob) {
        var self = this;
        var reader = new FileReader();
        reader.onload = function() {
          var decoded = BSON.deserialize(new Uint8Array(reader.result as ArrayBuffer));
          self.emit("onMessage", decoded);
        }
        reader.readAsArrayBuffer(message.data);
      }
    }    
  }

  public dispose() {
    this.wsConnection?.close();
  }
}

