import { ServiceRequest } from "./ServiceRequest";
import { ServiceResponse } from "./ServiceResponse";

export class AddTwoIntsRequest extends ServiceRequest {
  public static type : string = "example_interfaces/AddTwoInts";
  public a : number = 0;
  public b : number = 0;
}


export class AddTwoIntsResponse extends ServiceResponse {
  public static type : string = "example_interfaces/AddTwoInts";
  public sum : number = 0;
}

