const amqplib = require('amqplib/callback_api');

const queue = 'rpc_queue';
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
        
        ch2.prefetch(1);
        console.log(" [x] Awaiting RPC requests");

        ch2.consume(queue, function reply(msg) {
            
            const n = parseInt(msg.content.toString());

            console.log(" [.] fib(%d)", n);

            const r = fibonacci(n);

            ch2.sendToQueue(msg.properties.replyTo,
                Buffer.from(r.toString()), {
                    correlationId: msg.properties.correlationId
                });

            ch2.ack(msg);    
        });
    });
});

function fibonacci(n) {
    if (n === 0 || n === 1)
        return n;
    else
        return fibonacci(n - 1) + fibonacci(n - 2);
}
