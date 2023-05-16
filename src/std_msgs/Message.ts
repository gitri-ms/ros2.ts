import { Header } from "./Header";
import { plainToClassFromExist } from 'class-transformer';
 
export class Message extends Header {
  public static type : string = "std_msgs/Message";
  public static create<T extends Message> ( this: (new (...a: any[]) => T), values : any) : T {
    let m = new this();
    return plainToClassFromExist(m, values);
  }

  [name:string]: any
}

