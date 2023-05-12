import { ROSConnection } from '../src/ROSConnection'
import { LoopbackTransport } from './testutil';
import * as ROSString from '../src/std_msgs/String'
import { WebSocketTransport } from '../src/transport/WebSocketTransport';
import { plainToClass } from 'class-transformer';
 
describe("Testing Connection", () => {
  test('Test Loopback', () => {
    return new Promise<void>((resolve, reject) => {
      let ros = new ROSConnection();
      ros.connect(new LoopbackTransport()); 
      ros.on('connected', () => {
        let pub = ros.create_publisher<ROSString.String>("test");
        let sub = ros.create_subscription<ROSString.String>("test", (msg : ROSString.String) => {
          expect(msg.data).toBe("Hello World");
          resolve();
        });

        let s = new ROSString.String();
        s.data = "Hello World";
        pub.publish(s);
      });
    });
  })

  test('Test raw connect', async () : Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      let ros = new ROSConnection();
      ros.connect(new WebSocketTransport("ws://localhost:9090")); 
      ros.on('connected', () => {
        let sub = ros.create_subscription<ROSString.String>("/topic", (msg : any) => {
          let m = plainToClass(ROSString.String, msg);
          expect(m.data).toMatch(/^Hello, world!/);
          resolve();
        });

        sub.subscribe();
      });
    });
  }, 30000)
});
