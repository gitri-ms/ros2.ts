import EventEmitter from "events";
import WebSocket from "ws";
import http = require('http');
import CBOR from "cbor"
import { BSON } from "bson";
import { ITransport } from "./ITransport";

export class WebSocketTransport extends EventEmitter implements ITransport {
  public wsConnection : WebSocket | undefined = undefined;
  public url : string = "";

  'connected': () => void;
  'disconnected': () => void;
  'onMessage': (msg: any) => void;

  public constructor(url: string) {
    super();

    this.url = url;
  }

  public connect() {
    this.wsConnection = new WebSocket(this.url);
    this.wsConnection.binaryType = 'arraybuffer';

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
      } else if (message.data instanceof Blob) {
        var self = this;
        var reader = new FileReader();
        reader.onload = function() {
          var decoded = BSON.deserialize(new Uint8Array(reader.result as ArrayBuffer));
          self.emit("onMessage", decoded);
        }
        reader.readAsArrayBuffer(message.data);
      } else {
        var decoded = JSON.parse(message.data as string);
        this.emit("onMessage", decoded);
      } 
    }    
  }

  public disconnect() {
    this.emit("disconnected");
    this.wsConnection?.close();
  }

  public send(message: any) {
    if (this.wsConnection) {
      if (message instanceof ArrayBuffer || message instanceof Uint8Array || message instanceof Blob || message instanceof Buffer) {
        this.wsConnection.send(message);
      } else if (message instanceof String) {
        this.wsConnection.send(message);
      } else {
        this.wsConnection.send(JSON.stringify(message));
      }
    }
  }


  public dispose() {
    this.wsConnection?.close();
  }
}

