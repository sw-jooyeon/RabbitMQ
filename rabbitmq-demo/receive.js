// receive.js
import amqp from 'amqplib';

const queue = 'hello';

const receive = async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  await channel.assertQueue(queue, { durable: false });

  console.log(`[x] Waiting for messages in ${queue}`);
  channel.consume(queue, (msg) => {
    if (msg !== null) {
      console.log(`[x] Received: ${msg.content.toString()}`);
    }
  }, { noAck: true });
};

receive().catch(console.error);
