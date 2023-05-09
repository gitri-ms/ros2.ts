import EventEmitter from "events";
import { ROSConnection } from "./ROSConnection";

export class Publisher<T> {
  private rosConnection : ROSConnection;
  public topicName : string = "";

  public constructor(rosConnection : ROSConnection, topicName : string) {
    this.rosConnection = rosConnection;
    this.topicName = topicName;
  }

  public publish(message : T) {
    if (this.rosConnection.transport) {
      this.rosConnection.transport.send({
        op: "publish",
        id: this.rosConnection.createTrackingId("publish", this.topicName),
        topic: this.topicName,
        msg: JSON.stringify(message)
      });
    }
  }

}

