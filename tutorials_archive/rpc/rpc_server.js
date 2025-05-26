const amqplib = require('amqplib/callback_api');

const queue = 'rpc_queue';
const option = {
    hostname: "127.0.0.1",
    username: "dev",
    password: "dev",
    vhost: "development"
}

// RabbitMQ에 연결 시도
amqplib.connect(option, (err, conn) => {
  
    if (err) throw err;

    // 채널 생성
    conn.createChannel((err, ch2) => {
        if (err) throw err;
        
        // rpc_queue가 존재하지 않은 경우에 큐 생성
        ch2.assertQueue(queue, {
            durable: false
        });
        
        ch2.prefetch(1); // 한 번에 하나의 메시지 처리
        console.log(" [x] Awaiting RPC requests");

        // 큐로부터 메시지 소비
        ch2.consume(queue, function reply(msg) {
            
            const n = parseInt(msg.content.toString()); // 요청 메시지에서 숫자 파싱
            console.log(" [.] fib(%d)", n);

            const r = fibonacci(n);

            // 큐로 전송
            ch2.sendToQueue(msg.properties.replyTo,
                Buffer.from(r.toString()), {
                    correlationId: msg.properties.correlationId
                });

            ch2.ack(msg);    
        });
    });
});

// 피보나치 계산
function fibonacci(n) {
    if (n === 0 || n === 1)
        return n;
    else
        return fibonacci(n - 1) + fibonacci(n - 2);
}
