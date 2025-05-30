const amqp = require('amqplib');

const startConsumer = async (bindingHeaders) => {
  const exchange = 'headers_notifications';

  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();

  await channel.assertExchange(exchange, 'headers', { durable: false });

  const q = await channel.assertQueue('', { exclusive: true });

  await channel.bindQueue(q.queue, exchange, '', bindingHeaders);

  console.log(`[x] Waiting for messages with headers:`, bindingHeaders);

  channel.consume(q.queue, msg => {
    if (msg.content) {
      console.log(`[x] Received (headers: ${JSON.stringify(msg.properties.headers)}): ${msg.content.toString()}`);
    }
  }, { noAck: true });
};

const bindingHeaders = {
  'x-match': 'all', 
  type: 'user',
  action: 'created'
};

startConsumer(bindingHeaders).catch(console.error);
