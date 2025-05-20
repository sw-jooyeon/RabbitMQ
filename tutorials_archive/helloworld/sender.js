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
    
    conn.createChannel((err, ch1) => {
        
        if (err) throw err;
        
        const msg = 'Hello world';
        ch1.assertQueue(queue, {
            durable: false
        });
        
        ch1.sendToQueue(queue, Buffer.from(msg));
        console.log(" [x] Sent %s", msg);
    });
});
