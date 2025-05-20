const amqplib = require('amqplib/callback_api');

const queue = 'hello';
const option = {
    hostname: "127.0.0.1",
    username: "dev",
    password: "dev",
    vhost: "development"
}

amqplib.connect(option, (err, conn) => {
  
    if (err) throw err;

    conn.createChannel((err, ch2) => {
        if (err) throw err;

        ch2.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        ch2.consume(queue, (msg) => {
            console.log(" [x] Received %s", msg.content.toString());
        }, { noAck: true });
    });
});
