const amqplib = require('amqplib');

const option = {
    hostname: "127.0.0.1",
    username: "dev",
    password: "dev",
    vhost: "development"
}

class rpcClient {

    constructor(queue) {

        this.queue = queue;
        this.channel = null;
        this.replyQueue = null;
        this.correlationId = null;
    }

    async init() {

        const conn = await amqplib.connect(option);
        const channel = await conn.createChannel();
        this.channel = channel;

        const q = await channel.assertQueue('', {
            exclusive: true
        });
        this.replyQueue = q.queue;

        channel.consume(this.replyQueue, (msg) => {

            if (msg.properties.correlationId === this.correlationId) {

                console.log(' [.] Got ', msg.content.toString());
            }

        }, {
            noAck: true
        });
        
    }

    sendMsg(msg) {

        this.correlationId = generateUuid();

        console.log(' [x] Send ', msg);

        this.channel.sendToQueue(this.queue,
            Buffer.from(msg), {
                correlationId: this.correlationId,
                replyTo: this.replyQueue
            });
    }

}

function generateUuid() {

    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}

module.exports = rpcClient;
