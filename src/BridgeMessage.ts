export class BridgeMessage  {
  public op : string = "";
  public id : string = "";
  public topic : string = "";
  public service : string = "";
  public type : string = "";
  public msg : any;
  public compression : string = "";
  public throttle_rate : number = 0;
  public queue_length : number = 0;
  public latch : boolean = false;
  public args : any;
  public result : boolean = false;
  public values : any;
}

