import EventEmitter from "events";
import { ROSConnection } from "./ROSConnection";
import { BridgeMessage } from "./BridgeMessage";
import { Message } from "./std_msgs/Message";

export class Publisher<T extends Message> {
  private rosConnection : ROSConnection;
  public topicName : string = "";
  public latch : boolean = false; 
  public queue_length : number = 0;

  public constructor(rosConnection : ROSConnection, topicName : string, latch : boolean = false, queue_length : number = 0) {
    this.rosConnection = rosConnection;
    this.topicName = topicName;
    this.latch = latch;
    this.queue_length = queue_length;

  }

  public advertise() {
    let bm = new BridgeMessage();
    bm.op = "advertise";
    bm.id = this.rosConnection.createTrackingId("advertise", this.topicName);
    bm.topic = this.topicName;
    bm.type = (new Object() as T).type;
    bm.queue_length = this.queue_length;
    bm.latch = this.latch;

    this.rosConnection.transport?.send(bm);
  }

  public unadvertise() {
    let bm = new BridgeMessage();
    bm.op = "unadvertise";
    bm.id = this.rosConnection.createTrackingId("unadvertise", this.topicName);
    bm.topic = this.topicName;

    this.rosConnection.transport?.send(bm);
  }

  public publish(message : T) {
    if (this.rosConnection.transport) {
      let bm = new BridgeMessage();
      bm.op = "publish";
      bm.id = this.rosConnection.createTrackingId("publish", this.topicName);
      bm.topic = this.topicName;
      bm.msg = message;

      this.rosConnection.transport.send(bm);
    }
  }

}

