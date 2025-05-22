const amqplib = require('amqplib/callback_api');

const queue = 'rpc_queue';
const option = {
    hostname: "127.0.0.1",
    username: "dev",
    password: "dev",
    vhost: "development"
}

const args = process.argv.slice(2);
if (args.length == 0) {
    console.log("Usage: rpc_client.js num")
    process.exit(1);
}

amqplib.connect(option, (err, conn) => {
    
    if (err) throw err;
    
    conn.createChannel((err, ch1) => {
        
        if (err) throw err;

        ch1.assertQueue('', {
            exclusive: true
        }, (err, q) => {

            if (err) throw err;

            const correlationId = generateUuid();
            const num = parseInt(args[0]);

            console.log(' [x] Requestion fib(%d)', num);

            ch1.consume(q.queue, (msg) => {
                
                if (msg.properties.correlationId === correlationId) {
                    console.log(' [.] Got %s', msg.content.toString());

                    setTimeout(() =>{
                        conn.close();
                        process.exit(0);
                    }, 500);
               }

            }, {
                noAck: true
            });

            ch1.sendToQueue('rpc_queue',
                Buffer.from(num.toString()), {
                    correlationId: correlationId,
                    replyTo: q.queue
                });

        });

    });

});

function generateUuid() {

    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}
