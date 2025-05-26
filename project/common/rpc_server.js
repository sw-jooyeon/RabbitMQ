const amqplib = require('amqplib');

const queue = 'rpc.send.msg'
const option = {
    hostname: "127.0.0.1",
    username: "dev",
    password: "dev",
    vhost: "development"
}

(async () => {

    try {

        const conn = await amqplib.connect(option);
        const ch = await conn.createChannel();

        const { q } = await ch.assertQueue('', {
            exclusive: true
        });
        
        ch.prefetch(1);
        console.log(' [x] Awaiting RPC requests');

        ch.consume(q.queue, (msg) => {

            console.log(' [.] ', msg.content.toString());

            ch.sendToQueue(msg.properties.replyTo,
                Buffer.from(msg.toString()), {
                    correlationId: msg.properties.correlationId
                });

            ch.ack(msg);

        });


    } catch (err) {

        throw err;
        process.exit(1);
    }

}) ();
