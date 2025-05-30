const amqp = require('amqplib');

const startConsumer = async () => {
  const queue = 'task_queue';
  const exchange = 'direct_logs';
  const routingKey = 'info';

  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();

  await channel.assertExchange(exchange, 'direct', { durable: false });
  const q = await channel.assertQueue(queue, { durable: false });

  await channel.bindQueue(q.queue, exchange, routingKey);

  console.log(`[*] Waiting for messages in ${q.queue}. To exit press CTRL+C`);

  channel.consume(q.queue, msg => {
    if (msg.content) {
      console.log(`[x] Received '${msg.fields.routingKey}': ${msg.content.toString()}`);
    }
  }, { noAck: true });
};

startConsumer().catch(console.error);
