import { ROSConnection } from '../src/ROSConnection'
import { LoopbackTransport } from './testutil';
import * as ROSString from '../src/std_msgs/String'
import { WebSocketTransport } from '../src/transport/WebSocketTransport';
import { plainToClass } from 'class-transformer';
import { AddTwoIntsRequest, AddTwoIntsResponse } from '../src/std_srvs/AddTwoInts';
 
describe("Testing Service E2E", () => {
  test('Test Service Creation', () => {
    return new Promise<void>((resolve, reject) => {
      let ros = new ROSConnection();
      ros.on('connected', () => {
        try {
          let srv = ros.create_service<AddTwoIntsRequest, AddTwoIntsResponse>("add_two_ints");
          
          srv.advertise((msg : any) : any => {
            let m = AddTwoIntsRequest.create(msg);
            let r = new AddTwoIntsResponse();
            r.sum = m.a + m.b;
            return r;
          });

          resolve();
        }
        catch (e) {
          reject(e);
        }

        ros.disconnect();
      });

      ros.connect(new LoopbackTransport()); 
    });
  })

  test('Test Service Client Creation', () => {
    return new Promise<void>((resolve, reject) => {
      let ros = new ROSConnection();
      ros.on('connected', () => {
        try {
          let srv = ros.create_service<AddTwoIntsRequest, AddTwoIntsResponse>("add_two_ints");
          
          srv.advertise((msg : any) : any => {
            let m = AddTwoIntsRequest.create(msg);
            let r = new AddTwoIntsResponse();
            r.sum = m.a + m.b;
            return r;
          });

          let r = new AddTwoIntsRequest();
          r.a = 1;
          r.b = 2;

          srv.call(r).then((r) => {
            expect(r.sum).toEqual(3);
            resolve();
          }).catch((e) => {
            reject(e);
          });
        }
        catch (e) {
          reject(e);
        }

        ros.disconnect();
      });

      ros.connect(new LoopbackTransport()); 
    });
  })
});
