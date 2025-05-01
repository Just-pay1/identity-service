import amqp from 'amqplib';

const sendMessage = async (queue: string, body: object) => {
  try {
    const connection = await amqp.connect(
      'amqps://rxqzasmp:eUcjQTY-vMjPRmn8EgeUMGtYN1u_sEnF@goose.rmq2.cloudamqp.com/rxqzasmp'
    );
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: false });

    const jsonMessage = JSON.stringify(body);

    channel.sendToQueue(queue, Buffer.from(jsonMessage), {
      contentType: 'application/json',
    });

    console.log(` [x] Sent JSON to queue "${queue}":`, jsonMessage);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
export default sendMessage;
