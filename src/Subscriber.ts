import EventEmitter from "events";
import { ROSConnection } from "./ROSConnection";
import { BridgeMessage } from "./BridgeMessage";
import { Message } from "./Message";

export class Subscriber<T extends Message> extends EventEmitter {
  private rosConnection : ROSConnection;
  public topicName : string = "";
  public compression : string = "none";
  public throttle_rate : number = 0;
  public queue_length : number = 0;
  private callback : (msg : any) => void;

  public constructor(
    rosConnection : ROSConnection, 
    topicName : string, callback : (msg : any) => void, 
    compression : string = "none", 
    throttle_rate : number = 0, 
    queue_length : number = 100) {
    super();
    this.rosConnection = rosConnection;
    this.topicName = topicName;
    this.queue_length = queue_length;
    this.throttle_rate = throttle_rate;
    this.compression = compression;

    this.callback = callback;

    this.on("message", this.callback);

}

public subscribe() {
    let bm = new BridgeMessage();
    bm.op = "subscribe";
    bm.id = this.rosConnection.createTrackingId("subscribe", this.topicName);
    bm.topic = this.topicName;
    bm.type = (new Object() as T).type;
    bm.compression = this.compression;
    bm.queue_length = this.queue_length;
    bm.throttle_rate = this.throttle_rate;

    this.rosConnection.transport?.send(bm);
  }

  public unsubscribe() {
    this.rosConnection.subscriptions.delete(this.topicName);

    let bm = new BridgeMessage();
    bm.op = "unsubscribe";
    bm.id = this.rosConnection.createTrackingId("unsubscribe", this.topicName);
    bm.topic = this.topicName;

    this.rosConnection.transport?.send(bm);
  }

}
