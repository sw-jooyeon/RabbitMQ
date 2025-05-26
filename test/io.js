const amqp = require("amqplib");

(async () => {
  const conn = await amqp.connect("amqp://localhost");
  const ch = await conn.createChannel();
  const queue = "io_queue";

  await ch.assertQueue(queue, { durable: false });

  setInterval(() => {
    const msg = { from: "IO", data: "input data " + Date.now() };
    ch.sendToQueue("api_queue", Buffer.from(JSON.stringify(msg)));
    console.log("[IO] Sent:", msg);
  }, 5000);

  ch.consume(queue, (msg) => {
    if (msg !== null) {
      console.log("[IO] Received:", msg.content.toString());
      ch.ack(msg);
    }
  });
})();
