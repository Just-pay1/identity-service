import dotenv from 'dotenv';
dotenv.config();


export const RABBITMQ_IP = process.env.RABBITMQ_IP;
export const RABBITMQ_PORT = process.env.RABBITMQ_PORT;
export const RABBITMQ_USERNAME = process.env.RABBITMQ_USERNAME;
export const RABBITMQ_PASSWORD = process.env.RABBITMQ_PASSWORD;
export const MAILS_QUEUE = process.env.MAILS_QUEUE;
export const WALLET_CREATION_QUEUE = process.env.WALLET_CREATION_QUEUE;