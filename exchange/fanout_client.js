const amqp = require('amqplib');

const sendMessage = async (message) => {
  const exchange = 'logs';

  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();

  await channel.assertExchange(exchange, 'fanout', { durable: false });

  channel.publish(exchange, '', Buffer.from(message));
  console.log(`[x] Sent: ${message}`);

  setTimeout(() => {
    conn.close();
    process.exit(0);
  }, 500);
};

sendMessage('Broadcast message!').catch(console.error);
