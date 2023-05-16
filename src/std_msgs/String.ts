import { Message } from "./Message";

export class String extends Message {
  public static type: string = "std_msgs/String";
  public data: string = "";
}