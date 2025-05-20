// send.js
import amqp from 'amqplib';

const queue = 'hello';

const send = async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  await channel.assertQueue(queue, { durable: false });
  channel.sendToQueue(queue, Buffer.from('안녕하세요 RabbitMQ!'));

  console.log(`[x] Sent message`);
  await channel.close();
  await connection.close();
};

send().catch(console.error);
