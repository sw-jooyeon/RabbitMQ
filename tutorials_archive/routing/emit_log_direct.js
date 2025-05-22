const amqplib = require('amqplib/callback_api');

const queue = 'direct_log';
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

        const exchange = 'direct_logs';
        const args = process.argv.slice(2);
        const msg = args.slice(1).join(' ') || "Hello World!";
        const severity = (args.length > 0) ? args[0] : 'info';

        ch1.assertExchange(exchange, 'direct', {
            durable: false
        })

        ch1.publish(exchange, severity, Buffer.from(msg));
        console.log(" [x] Sent %s: '%s'", severity, msg);
        
    });

    setTimeout(() => {
        conn.close();
        process.exit(0);
    }, 500);

});
