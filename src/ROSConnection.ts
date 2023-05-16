// export * from "./GeometryCylinder"

import EventEmitter from "events";
import { ITransport } from "./transport/ITransport";
import { Publisher } from "./Publisher";
import { Subscriber } from "./Subscriber";
import { Message } from "./std_msgs/Message";
import { Service } from "./Service";
import { ServiceRequest } from "./std_srvs/ServiceRequest";
import { ServiceResponse } from "./std_srvs/ServiceResponse";

export class ROSConnection extends EventEmitter {
  public transport: ITransport | undefined;
  public subscriptions: Map<string, Subscriber<any>[]> = new Map<string, Subscriber<any>[]>();
  private id_counter: number = 0;

  'connected': () => void;
  'disconnected': () => void;


  public createTrackingId(prefix: string, suffix: string) {
    return prefix + ":" + suffix + ":" + ++this.id_counter;
  }

  public connect(transport: ITransport) {
    this.setMaxListeners(0);
    
    this.transport = transport;
    this.transport.on('onMessage', (msg: any) => {
      this.processMessage(msg);
    });

    this.transport.on('connected', () => {
      this.emit("connected");
    });

    this.transport.on('disconnected', () => {
      this.emit("disconnected");
    });


    this.transport.connect();
  }

  public disconnect() {
    this.transport?.disconnect();
  }

  public create_service<T extends ServiceRequest, R extends ServiceResponse>(service : string) : Service<T, R> {
    return new Service<T, R>(this, service);
  }

  public create_publisher<T extends Message>(topic : string) : Publisher<T> {
    return new Publisher<T>(this, topic);
  }
  
  public create_subscription<T extends Message>(topic : string, callback : (msg : T) => void) : Subscriber<T> {
    let s = new Subscriber<T>(this, topic, callback);
    if (this.subscriptions.has(topic)) {
      this.subscriptions.get(topic)?.push(s);
    } else {
      this.subscriptions.set(topic, [s]);
    }
    return s;
  }

  private processMessage(message: any) {
    // ROS-Bridge Protocol:
    // 
    switch (message.op) {
      case "publish":
        this.subscriptions.get(message.topic)?.every((s) => {
          s.emit("message", message.msg);          
        });
        break;
      case "service_response":
        this.emit(message.id, message);
        break;
      case "call_service":
        this.emit(message.service, message);
        break;
      case "status":
        console.log("Status?: " + JSON.stringify(message));
        break;
        default:
          console.log("Unknown message type: " + message.op);
        break;
    }
  }



}

