const amqp = require("amqplib");

(async () => {
  const conn = await amqp.connect("amqp://localhost");
  const ch = await conn.createChannel();
  const queue = "notification_queue";

  await ch.assertQueue(queue, { durable: false });

  ch.consume(queue, (msg) => {
    if (msg !== null) {
      console.log("[Notification] 📢", msg.content.toString());
      ch.ack(msg);
    }
  });
})();
