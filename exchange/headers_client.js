const amqp = require('amqplib');

const sendMessage = async (message, headers) => {
  const exchange = 'headers_notifications';

  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();

  await channel.assertExchange(exchange, 'headers', { durable: false });

  channel.publish(exchange, '', Buffer.from(message), { headers });
  console.log(`[x] Sent: ${message} (headers: ${JSON.stringify(headers)})`);

  setTimeout(() => {
    conn.close();
    process.exit(0);
  }, 500);
};

const headers = {
  type: 'user',
  action: 'created'
};

sendMessage('A new user was created!', headers).catch(console.error);
