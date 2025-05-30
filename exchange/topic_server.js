const amqp = require('amqplib');

const startConsumer = async (bindingKey) => {
  const exchange = 'topic_notifications';

  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();

  await channel.assertExchange(exchange, 'topic', { durable: false });

  const q = await channel.assertQueue('', { exclusive: true });

  await channel.bindQueue(q.queue, exchange, bindingKey);

  console.log(`[x] Waiting for messages with pattern "${bindingKey}". Queue: ${q.queue}`);

  channel.consume(q.queue, msg => {
    if (msg.content) {
      console.log(`[x] Received (${msg.fields.routingKey}): ${msg.content.toString()}`);
    }
  }, { noAck: true });
};

const bindingKey = process.argv[2] || '#';
startConsumer(bindingKey).catch(console.error);
