const amqp = require('amqplib');

const sendMessage = async (routingKey, message) => {
  const exchange = 'topic_notifications';

  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();

  await channel.assertExchange(exchange, 'topic', { durable: false });

  channel.publish(exchange, routingKey, Buffer.from(message));
  console.log(`[x] Sent (${routingKey}): ${message}`);

  setTimeout(() => {
    conn.close();
    process.exit(0);
  }, 500);
};

const routingKey = process.argv[2] || 'user.created';
const message = process.argv[3] || 'A new user has registered.';
sendMessage(routingKey, message).catch(console.error);
