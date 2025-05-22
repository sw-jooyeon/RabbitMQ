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

    conn.createChannel((err, ch2) => {
        if (err) throw err;
        
        ch2.assertQueue(queue, {
            durable: true
        });
        
        ch2.prefetch(1);

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        ch2.consume(queue, (msg) => {
            
            const secs = msg.content.toString().split('.').length - 1;

            console.log(" [x] Received %s", msg.content.toString());

            setTimeout(function() {
                console.log(" [x] Done");
                ch2.ack(msg);
            }, secs * 1000);

        }, { noAck: false });
    });
});
