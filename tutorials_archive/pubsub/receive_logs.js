const amqplib = require('amqplib/callback_api');

const queue = 'log_queue';
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
        
        const exchange = 'logs';

        ch2.assertExchange(exchange, 'fanout', {
            durable: false
        });
        
        ch2.assertQueue('', {
            exclusive: true
        }, (err, q) => {

            if (err) throw err

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
            ch2.bindQueue(q.queue, exchange, '');

            ch2.consume(q.queue, (msg) => {

                if (msg.content) {
                    console.log(" [x] %s", msg.content.toString());
                }

            }, {
                noAck: true
            });

        });

        
    });
});
