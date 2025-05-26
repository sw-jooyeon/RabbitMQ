const amqp = require("amqplib");

(async () => {
  const conn = await amqp.connect("amqp://localhost");
  const ch = await conn.createChannel();
  const queue = "scheduler_queue";

  await ch.assertQueue(queue, { durable: false });

  ch.consume(queue, (msg) => {
    if (msg !== null) {
      console.log("[Scheduler] ⏰", msg.content.toString());
      ch.ack(msg);
    }
  });
})();
