const amqplib = require('amqplib');

const queue = 'rpc.send.msg'
const option = {
    hostname: "127.0.0.1",
    username: "dev",
    password: "dev",
    vhost: "development"
}

async function rpcClient() {

    // 연결 및 채널 생성
    const conn = await amqplib.connect(option);
    const ch = await conn.createChannel();

    // 임시 큐 생성
    const { q } = await ch.assertQueue('', {
        exclusive: true
    });
    const replyQueue = q.queue;

    // 메시지 도착
    ch.consume(replyQueue, (msg) => {

        if (msg.properties.correlationId === correlationId) { // correlationId가 일치하는 경우

            console.log(' [.] Got ', msg.content.toString());

        }

    }, {noAck: true});

    // 메시지 전송
    async function call(targetQueue, msg) {

        // correlationId 생성
        const correlationId = generateUuid();

        ch.sendToQueue(targetQueue,
            Buffer.from(msg), {
                correlationId: correlationId,
                replyTo: replyQueue
            });

        return response;

    }

    return {call};

}

function generateUuid() {

    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}

module.exports = rpcClient;
