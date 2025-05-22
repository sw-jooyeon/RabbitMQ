const amqplib = require('amqplib/callback_api');

const queue = 'direct_log';
const option = {
    hostname: "127.0.0.1",
    username: "dev",
    password: "dev",
    vhost: "development"
}

const args = process.argv.slice(2);
if (args.length == 0) {
    console.log("Usage: receive_logs_direct.js [info] [warning] [error]")
    process.exit(1);
}

amqplib.connect(option, (err, conn) => {
  
    if (err) throw err;

    conn.createChannel((err, ch2) => {
        if (err) throw err;
        
        const exchange = 'direct_logs';

        ch2.assertExchange(exchange, 'direct', {
            durable: false
        });
        
        ch2.assertQueue('', {
            exclusive: true
        }, (err, q) => {

            if (err) throw err

            console.log(" [*] Waiting for logs. To exit press CTRL+C");
            
            args.forEach((severity) => {
                ch2.bindQueue(q.queue, exchange, severity);
            });

            ch2.consume(q.queue, (msg) => {

                console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());

            }, {
                noAck: true
            });

        });
        
    });
});
