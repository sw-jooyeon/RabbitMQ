const amqplib = require('amqplib');

const option = {
    hostname: "127.0.0.1",
    username: "dev",
    password: "dev",
    vhost: "development"
}


async function rpcServer(queue, handleMessage) {

    const conn = await amqplib.connect(option);
    const ch = await conn.createChannel();

    await ch.assertQueue(queue, {
        durable: false
    });
    ch.prefetch(1);

    ch.consume(queue, async (msg) => {

        console.log(' [x] Received ', msg.content.toString());

        const response = await handleMessage(msg.content.toString());

        ch.sendToQueue(msg.properties.replyTo,
            Buffer.from(response.toString()),
            {
                correlationId: msg.properties.correlationId
            }
        );

        ch.ack(msg);
    });

}

module.exports = rpcServer;
