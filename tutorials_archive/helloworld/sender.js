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
        
        // 메시지를 Buffer 객체로 변환
        // Buffer.from(msg): 문자열을 바이너리 형식으로 인코딩 (RabbitMQ는 바이너리 형식을 요구)
        ch1.sendToQueue(queue, Buffer.from(msg));
        console.log(" [x] Sent %s", msg);
    });
});
