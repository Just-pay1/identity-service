import { EventEmitter } from 'events';


class MyEventEmitter extends EventEmitter {}

const eventEmitter = new MyEventEmitter();

export default eventEmitter;