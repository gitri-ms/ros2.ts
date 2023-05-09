import EventEmitter from "events";
import { ROSConnection } from "./ROSConnection";

export class Subscriber<T> extends EventEmitter {
  private rosConnection : ROSConnection;
  public topicName : string = "";

  public constructor(rosConnection : ROSConnection, topicName : string) {
    super();
    this.rosConnection = rosConnection;
    this.topicName = topicName;
  }

  public unsubscribe() {
    this.rosConnection.subscriptions.delete(this.topicName);
  }
}

