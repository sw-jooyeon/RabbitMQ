const amqplib = require('amqplib/callback_api'); // amqplib 패키지의 콜백 기반 API를 사용하여 RabbitMQ와 통신할 수 있게 함

const queue = 'rpc_queue';
// RabbitMQ 서버 연결 정보
const option = {
    hostname: "127.0.0.1",
    username: "dev",
    password: "dev",
    vhost: "development"
}

const args = process.argv.slice(2); // 명령줄 인수에서 피보나치 숫자 입력 받기
if (args.length == 0) { // 입력값이 없는 경우

    console.log("Usage: rpc_client.js num") // 사용법 출력
    process.exit(1); // 종료
}

// RabbitMQ에 연결 시도
amqplib.connect(option, (err, conn) => {
    
    if (err) throw err;
    
    // 채널 생성
    conn.createChannel((err, ch1) => {
        
        if (err) throw err;

        // 임시 큐 생성
        ch1.assertQueue('', {
            exclusive: true
        }, (err, q) => {

            if (err) throw err;

            const correlationId = generateUuid();
            const num = parseInt(args[0]); // 숫자 파싱

            console.log(' [x] Requestion fib(%d)', num);

            // 큐로부터 메시지 소비
            ch1.consume(q.queue, (msg) => {
                
                if (msg.properties.correlationId === correlationId) { // 동일한 correlationId인 경우
                    console.log(' [.] Got %s', msg.content.toString());

                    setTimeout(() =>{
                        conn.close();
                        process.exit(0);
                    }, 500);
               }

            }, {
                noAck: true
            });

            // 큐로 전송
            ch1.sendToQueue('rpc_queue',
                Buffer.from(num.toString()), {
                    correlationId: correlationId,
                    replyTo: q.queue
                });

        });

    });

});

// ID 생성
function generateUuid() {

    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}
