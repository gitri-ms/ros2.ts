import { Message } from "../std_msgs/Message";

export class ServiceRequest extends Message {
  public static type : string = "std_srv/ServiceRequest";
  [name:string]: any
}

