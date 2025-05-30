const amqplib = require('amqplib');

const option = {
    hostname: "127.0.0.1",
    username: "dev",
    password: "dev",
    vhost: "development"
}

class rpcServer {

    constructor(queue, handleMessage) {

        this.queue = queue;
        this.handleMessage = handleMessage;
        this.channel = null;
    }

    async init() {

        const conn = await amqplib.connect(option);
        const channel = await conn.createChannel();
        this.channel = channel;

        await channel.assertQueue(this.queue, {
            durable: false
        });
        channel.prefetch(1);

        channel.consume(this.queue, async (msg) => {
            
            console.log(' [x] Received ', msg.content.toString());

            const response = await this.handleMessage(msg.content.toString());

            channel.sendToQueue(msg.properties.replyTo,
                Buffer.from(response.toString()), {
                    correlationId: msg.properties.correlationId
                });

            channel.ack(msg);
        });
    }
}

module.exports = rpcServer;
