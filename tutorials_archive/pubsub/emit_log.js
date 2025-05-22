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
    
    conn.createChannel((err, ch1) => {
        
        if (err) throw err;

        const exchange = 'logs';
        const msg = process.argv.slice(2).join(' ') || "Hello World!";

        ch1.assertExchange(exchange, 'fanout', {
            durable: false
        })

        ch1.publish(exchange, '', Buffer.from(msg));
        console.log(" [x] Sent %s", msg);
        
    });

    setTimeout(() => {
        conn.close();
        process.exit(0);
    }, 500);

});
