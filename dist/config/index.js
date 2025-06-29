"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WALLET_CREATION_QUEUE = exports.MAILS_QUEUE = exports.RABBITMQ_PASSWORD = exports.RABBITMQ_USERNAME = exports.RABBITMQ_PORT = exports.RABBITMQ_IP = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.RABBITMQ_IP = process.env.RABBITMQ_IP;
exports.RABBITMQ_PORT = process.env.RABBITMQ_PORT;
exports.RABBITMQ_USERNAME = process.env.RABBITMQ_USERNAME;
exports.RABBITMQ_PASSWORD = process.env.RABBITMQ_PASSWORD;
exports.MAILS_QUEUE = process.env.MAILS_QUEUE;
exports.WALLET_CREATION_QUEUE = process.env.WALLET_CREATION_QUEUE;
