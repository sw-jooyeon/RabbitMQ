const amqplib = require('amqplib/callback_api');

const queue = 'topic_log';
const option = {
    hostname: "127.0.0.1",
    username: "dev",
    password: "dev",
    vhost: "development"
}

const args = process.argv.slice(2);
if (args.length == 0) {
    console.log("Usage: receive_logs_topic.js <facility>.<severity>");
    process.exit(1);
}

amqplib.connect(option, (err, conn) => {
  
    if (err) throw err;

    conn.createChannel((err, ch2) => {
        if (err) throw err;
        
        const exchange = 'topic_logs';

        ch2.assertExchange(exchange, 'topic', {
            durable: false
        });
        
        ch2.assertQueue('', {
            exclusive: true
        }, (err, q) => {

            if (err) throw err

            console.log(" [*] Waiting for logs. To exit press CTRL+C");

            args.forEach((key) => {

                ch2.bindQueue(q.queue, exchange, key);
            });

            ch2.consume(q.queue, (msg) => {

                console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString())

            }, {
                noAck: true
            });

        });

        
    });
});
