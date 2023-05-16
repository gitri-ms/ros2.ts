import EventEmitter from "events";
import { BridgeMessage } from "./BridgeMessage";
import { ROSConnection } from "./ROSConnection";
import { ServiceRequest } from "./std_srvs/ServiceRequest";
import { promises } from "dns";
import { ServiceResponse } from "./std_srvs/ServiceResponse";
import { isBooleanObject } from "util/types";

export class Service<T extends ServiceRequest, R extends ServiceResponse> extends EventEmitter {
  private rosConnection : ROSConnection;
  public serviceName : string = "";

  public constructor(
    rosConnection : ROSConnection, 
    serviceName : string) {
    super();
    this.rosConnection = rosConnection;
    this.serviceName = serviceName;
  }

  public advertise(callback : (msg : any) => R) {
    this.rosConnection.on(this.serviceName, (msg : any) => {
      let success = false;
      let serviceResult : R;
      try {
        serviceResult = callback(msg.args); 
        success = true;
      } catch (e) {
        // todo log?

        return;
      }

      let bm = new BridgeMessage();
      bm.op = "service_response";
      bm.id = msg.id;
      bm.service = this.serviceName;
      bm.values = serviceResult;
      bm.result = success;

      this.rosConnection.transport?.send(bm);
    });

    let bm = new BridgeMessage();
    bm.op = "advertise_service";
    bm.id = this.rosConnection.createTrackingId("service", this.serviceName);
    bm.service = this.serviceName;
    bm.type = (new Object() as T).type;

    this.rosConnection.transport?.send(bm);

  }

  public unadvertise() {
    let bm = new BridgeMessage();
    bm.op = "unadvertise_service";
    bm.id = this.rosConnection.createTrackingId("service", this.serviceName);
    bm.service = this.serviceName;

    this.rosConnection.transport?.send(bm);
  }

  public call(request : T) : Promise<ServiceResponse> {

    return new Promise<ServiceResponse>((resolve, reject) => {
      if (this.rosConnection.transport) {
        let bm = new BridgeMessage();
        bm.op = "call_service";
        bm.id = this.rosConnection.createTrackingId("service", this.serviceName);
        bm.service = this.serviceName;
        bm.type = (new Object() as T).type;
        bm.args = request;

        this.rosConnection.once(bm.id, (msg : any) => {
          if (typeof msg.result === "boolean" && msg.result) {
            resolve(msg.values);
          } else {
            reject(msg.values);
          }
        });

        this.rosConnection.transport.send(bm);
      }
    });
  }
}
