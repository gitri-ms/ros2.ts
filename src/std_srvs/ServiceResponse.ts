import { Message } from "../std_msgs/Message";

export class ServiceResponse extends Message {
  public static type : string = "std_srv/ServiceResponse";
  [name:string]: any
}

