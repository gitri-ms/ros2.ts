import EventEmitter from "events";
import { ActionClient } from "./ActionClient";
import { ROSConnection } from "../ROSConnection";
import { Message } from "../std_msgs/Message";

export class Goal extends Message {
    public goal_id : string = "";

}