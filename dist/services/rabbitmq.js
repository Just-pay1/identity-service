"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = __importDefault(require("amqplib"));
const sendMessage = (queue, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield amqplib_1.default.connect('amqps://rxqzasmp:eUcjQTY-vMjPRmn8EgeUMGtYN1u_sEnF@goose.rmq2.cloudamqp.com/rxqzasmp');
        console.log("connection is submitted");
        const channel = yield connection.createChannel();
        yield channel.assertQueue(queue, { durable: false });
        const jsonMessage = JSON.stringify(body);
        channel.sendToQueue(queue, Buffer.from(jsonMessage), {
            contentType: 'application/json',
        });
        console.log(` [x] Sent JSON to queue "${queue}":`, jsonMessage);
        yield channel.close();
        yield connection.close();
    }
    catch (error) {
        console.error('Error sending message:', error);
    }
});
exports.default = sendMessage;
