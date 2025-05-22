const amqplib = require('amqplib/callback_api');

const queue = 'topic_log';
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

        const exchange = 'topic_logs';
        const args = process.argv.slice(2);
        const key = (args.length > 0) ? args[0] : 'anonymous.info';
        const msg = args.slice(1).join(' ') || "Hello World!";

        ch1.assertExchange(exchange, 'topic', {
            durable: false
        })

        ch1.publish(exchange, key, Buffer.from(msg));
        console.log(" [x] Sent %s: '%s'", key, msg);
        
    });

    setTimeout(() => {
        conn.close();
        process.exit(0);
    }, 500);

});
