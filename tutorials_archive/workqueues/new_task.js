const amqplib = require('amqplib/callback_api');

const queue = 'task_queue';
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

        const msg = process.argv.slice(2).join(' ') || "Hello World!";

        ch1.assertQueue(queue, {
            durable: true
        });
        ch1.sendToQueue(queue, Buffer.from(msg), {
            persistent: true
        });
        console.log(" [x] Sent %s", msg);
    });

    setTimeout(function() {
        conn.close();
        process.exit(0);
    }, 500);

});
