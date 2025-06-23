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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const RABBITMQ_IP = process.env.RABBITMQ_IP;
const RABBITMQ_PORT = process.env.RABBITMQ_PORT;
const RABBITMQ_USERNAME = process.env.RABBITMQ_USERNAME;
const RABBITMQ_PASSWORD = process.env.RABBITMQ_PASSWORD;
const MAILS_QUEUE = process.env.MAILS_QUEUE;
const WALLET_CREATION_QUEUE = process.env.WALLET_CREATION_QUEUE;
class RabbitMQ {
    constructor() {
        this.mailChannel = null;
        this.walletCreationChannel = null;
    }
    static getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!RabbitMQ.instance) {
                RabbitMQ.instance = new RabbitMQ();
                yield RabbitMQ.instance.init();
            }
            return RabbitMQ.instance;
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.connection = yield amqplib_1.default.connect({
                    protocol: 'amqps',
                    hostname: RABBITMQ_IP || 'localhost',
                    port: Number(RABBITMQ_PORT) || 5672,
                    username: RABBITMQ_USERNAME,
                    password: RABBITMQ_PASSWORD,
                    vhost: RABBITMQ_USERNAME,
                    frameMax: 8192 // Ensure this is at least 8192
                });
                this.mailChannel = yield this.connection.createChannel();
                this.walletCreationChannel = yield this.connection.createChannel();
                // assert each queue to its channel
                yield this.mailChannel.assertQueue(MAILS_QUEUE);
                yield this.walletCreationChannel.assertQueue(WALLET_CREATION_QUEUE, { durable: false });
                console.log('== RabbitMQ Connected ==');
            }
            catch (error) {
                console.error('RabbitMQ Connection Error:', error);
            }
        });
    }
    sendMail(message) {
        var _a;
        (_a = this.mailChannel) === null || _a === void 0 ? void 0 : _a.sendToQueue(MAILS_QUEUE, Buffer.from(JSON.stringify(message)));
        console.log('mail sent');
    }
    pushInWalletCreationQueue(args) {
        var _a;
        (_a = this.walletCreationChannel) === null || _a === void 0 ? void 0 : _a.sendToQueue(WALLET_CREATION_QUEUE, Buffer.from(JSON.stringify(args)));
        console.log('wallet creation request sent');
    }
}
exports.default = RabbitMQ;
