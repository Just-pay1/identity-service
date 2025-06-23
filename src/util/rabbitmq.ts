import amqp, { Channel, ChannelModel, ConsumeMessage } from "amqplib";
import dotenv from 'dotenv';
import { EmailRequest } from "./shared-interfaces";

dotenv.config();
const RABBITMQ_IP = process.env.RABBITMQ_IP;
const RABBITMQ_PORT = process.env.RABBITMQ_PORT;
const RABBITMQ_USERNAME = process.env.RABBITMQ_USERNAME;
const RABBITMQ_PASSWORD = process.env.RABBITMQ_PASSWORD;
const MAILS_QUEUE = process.env.MAILS_QUEUE;
const WALLET_CREATION_QUEUE = process.env.WALLET_CREATION_QUEUE;



class RabbitMQ {
    private static instance: RabbitMQ;
    private connection!: ChannelModel;
    private mailChannel: Channel | null = null;
    private walletCreationChannel: Channel | null = null;



    public static async getInstance(): Promise<RabbitMQ> {
        if (!RabbitMQ.instance) {
            RabbitMQ.instance = new RabbitMQ();
            await RabbitMQ.instance.init();
        }
        return RabbitMQ.instance;
    }


    private async init(): Promise<void> {
        try {
            this.connection = await amqp.connect({
                protocol: 'amqps',
                hostname: RABBITMQ_IP || 'localhost',
                port: Number(RABBITMQ_PORT) || 5672,
                username: RABBITMQ_USERNAME,
                password: RABBITMQ_PASSWORD,
                vhost: RABBITMQ_USERNAME,
                frameMax: 8192 // Ensure this is at least 8192
            });

            this.mailChannel = await this.connection.createChannel();
            this.walletCreationChannel = await this.connection.createChannel();


            // assert each queue to its channel
            await this.mailChannel.assertQueue(MAILS_QUEUE!)
            await this.walletCreationChannel.assertQueue(WALLET_CREATION_QUEUE!, { durable: false })


            console.log('== RabbitMQ Connected ==');
        } catch (error) {
            console.error('RabbitMQ Connection Error:', error);
        }
    }

    public sendMail(message: EmailRequest) {
        this.mailChannel?.sendToQueue(MAILS_QUEUE!, Buffer.from(JSON.stringify(message)))
        console.log('mail sent');
    }

    public pushInWalletCreationQueue(args: { userId: number }){
        this.walletCreationChannel?.sendToQueue(WALLET_CREATION_QUEUE!, Buffer.from(JSON.stringify(args)))
        console.log('wallet creation request sent');
    }


}

export default RabbitMQ;