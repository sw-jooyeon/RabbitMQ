const amqplib = require('amqplib');

const option = {
    hostname: "127.0.0.1",
    username: "dev",
    password: "dev",
    vhost: "development"
}

async function rpcClient(queue) {

    const conn = await amqplib.connect(option);
    const ch = await conn.createChannel();

    const q = await ch.assertQueue('', {
        exclusive: true
    });
    const replyQueue = q.queue;

    let correlationId = null;

    ch.consume(replyQueue, (msg) => {

        if (msg.properties.correlationId === correlationId) {

            console.log(' [.] Got ', msg.content.toString());
        }

    }, {
        noAck: true
    });

    function sendMsg(msg) {

        correlationId = generateUuid();

        console.log(' [x] Send ', msg);

        ch.sendToQueue(queue,
            Buffer.from(msg), {
                correlationId: correlationId,
                replyTo: replyQueue
            });

    }

    return { sendMsg };
}

function generateUuid() {

    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}

module.exports = rpcClient;
