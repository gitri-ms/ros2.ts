import EventEmitter from "events";
import { ROSConnection } from "../ROSConnection";
import { BridgeMessage } from "../BridgeMessage";
import { Message } from "../std_msgs/Message";
import { Goal } from "./Goal";
import { Feedback } from "./Feedback";
import { Result } from "./Result";
import { GoalID } from "./GoalID";
import { Publisher } from "../Publisher";
import { Subscriber } from "../Subscriber";
import { UUID } from "bson";

export class ActionClient<G extends Goal, F extends Feedback, R extends Result> extends EventEmitter {
    private rosConnection : ROSConnection;
    private goalPublisher : Publisher<G>;
    private cancelPublisher : Publisher<GoalID>;
    private feedbackSubscriber : Subscriber<F>;
    private resultSubscriber : Subscriber<R>;

    private goals : Map<string, G> = new Map<string, G>();
    
    public constructor(rosConnection : ROSConnection, serverName : string) {
        super();
        this.rosConnection = rosConnection;


        this.feedbackSubscriber = this.rosConnection.create_subscription<F>(serverName + "/feedback", (msg : any) => {
        });

        this.resultSubscriber = this.rosConnection.create_subscription<R>(serverName + "/result", (msg : any) => {
        });

        //this.rosConnection.create_subscription<S>(serverName + "/status", (msg : any) => {});

        this.goalPublisher = this.rosConnection.create_publisher<G>(serverName + "/goal");
        this.cancelPublisher = this.rosConnection.create_publisher<GoalID>(serverName + "/cancel");
    }

    public send(goal : G) {
        goal.goal_id = this.rosConnection.createTrackingId("goal", UUID.generate().toString());
        this.goals.set(goal.goal_id, goal);
        this.goalPublisher.publish(goal);
    }

    public cancel() {
    }

    public wait_for_result() {
    }
}
