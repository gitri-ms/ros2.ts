import { Message } from "../std_msgs/Message";

export class GoalID extends Message {
    public static type : string = "actionlib_msgs/GoalID";
    public id : string = "";
}