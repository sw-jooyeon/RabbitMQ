const amqp = require('amqplib');

const startConsumer = async () => {
  const exchange = 'logs';

  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();

  await channel.assertExchange(exchange, 'fanout', { durable: false });

  const q = await channel.assertQueue('', { exclusive: true });

  console.log(`[x] Waiting for messages in queue: ${q.queue}`);
  
  channel.bindQueue(q.queue, exchange, '');

  channel.consume(q.queue, msg => {
    if (msg.content) {
      console.log(`[x] Received: ${msg.content.toString()}`);
    }
  }, { noAck: true });
};

startConsumer().catch(console.error);
