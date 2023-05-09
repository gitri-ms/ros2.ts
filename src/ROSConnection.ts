// export * from "./GeometryCylinder"

import EventEmitter from "events";
import { ITransport } from "./transport/ITransport";
import { Publisher } from "./Publisher";
import { Subscriber } from "./Subscriber";

export class ROSConnection extends EventEmitter {
  public transport: ITransport | undefined;
  public subscriptions: Map<string, Subscriber<any>> = new Map<string, Subscriber<any>>();
  private id_counter: number = 0;


  public createTrackingId(prefix: string, suffix: string) {
    return prefix + ":" + suffix + ":" + ++this.id_counter;
  }

  public connect(transport: ITransport) {
    this.transport = transport;
    this.transport.onMessage = (msg : any) => {
      this.processMessage(msg);
    }

    this.transport.connect();
  }

  public create_publisher<T>(topic : string, messageType : T) : Publisher<T> {
    return new Publisher<T>(this, topic);
  }
  
  public create_subscription<T>(topic : string, callback : (msg : T) => void) : Subscriber<T> {
    let s = new Subscriber<T>(this, topic);
    this.subscriptions.set(topic, s);

    s.on("message", callback);

    return s;
  }

  private processMessage(message: any) {
    // ROS-Bridge Protocol:
    // 
    switch (message.op) {
      case "publish":
        this.subscriptions.get(message.topic)?.emit("message", JSON.parse(message.msg));
        break;
      case "service_response":
        break;
      case "call_service":
        break;
      case "advertise":
        break;
      case "unadvertise":
        break;
      case "service_request":
        break;
      case "status":
        break;
        default:
          console.log("Unknown message type: " + message.op);
        break;
    }
  }



}

