const amqp = require('amqplib');

const sendMessage = async (message, routingKey = 'info') => {
  const exchange = 'direct_logs';

  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();

  await channel.assertExchange(exchange, 'direct', { durable: false });

  channel.publish(exchange, routingKey, Buffer.from(message));
  console.log(`[x] Sent '${routingKey}': '${message}'`);

  setTimeout(() => {
    conn.close();
    process.exit(0);
  }, 500);
};

sendMessage('Hello from client!', 'info').catch(console.error);
