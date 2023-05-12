import { Header } from "./Header";

export class Message extends Header {
  public static type : string = "std_msgs/Message";
  [name:string]: any
}

