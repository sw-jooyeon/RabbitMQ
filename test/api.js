const amqp = require("amqplib");

(async () => {
  const conn = await amqp.connect("amqp://localhost");
  const ch = await conn.createChannel();
  const queue = "api_queue";

  await ch.assertQueue(queue, { durable: false });

  ch.consume(queue, (msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString());
      console.log("[API] Received from IO:", data);

      ch.sendToQueue("notification_queue", Buffer.from(JSON.stringify({ from: "API", message: "Notify user" })));
      ch.sendToQueue("scheduler_queue", Buffer.from(JSON.stringify({ from: "API", task: "Run task" })));

      ch.ack(msg);
    }
  });
})();
