// require(): 외부 모델 가져옴
// const: 재할당 불가능한 상수 선언
const amqplib = require('amqplib/callback_api');

// 큐 이름 설정
const queue = 'hello';

// 객체 리터럴 문법으로 옵션 설정
const option = {
    hostname: "127.0.0.1",
    username: "dev",
    password: "dev",
    vhost: "development" // 네임스페이스 역할
}

// amqplib.connect(): RabbitMQ에 연결 시도
// option: 접속 설정
// err: 연결 실패 시 에러 객체
// conn: 연결 성공 시 연결 객체
amqplib.connect(option, (err, conn) => {
  
    if (err) throw err;

    conn.createChannel((err, ch2) => {// ch2: 생성된 채널 객체
        if (err) throw err;

        // assertQueue(queue, options): 지정된 큐가 존재하지 않으면 새로 생성
        ch2.assertQueue(queue, {
            durable: false // 서버 재시작 시 큐가 유지되지 않음
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        // consume(queue, callback, options): 큐에서 메시지를 계속해서 받음
        // callback(msg): 메시지 수신 시 실행될 함수
        // { noAck: true }: 메시지를 받은 후 수동으로 응답하지 않아도 됨 (자동 처리)
        ch2.consume(queue, (msg) => {
            console.log(" [x] Received %s", msg.content.toString());
        }, { noAck: true });
    });
});
