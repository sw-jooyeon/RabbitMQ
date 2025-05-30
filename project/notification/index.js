const rpcClient = require('../common/rpc_client');
const rpcServer = require('../common/rpc_server');

async function handleMessage(msg) {

    const response = ` ${msg} 요청을 [notification]에서 받았습니다.`;
    
    return response;
}

async function startNotification() {
    
    const server = new rpcServer('rpc.queue.notification', handleMessage);
    await server.init();

    const ioClient = new rpcClient('rpc.queue.io');
    await ioClient.init();

    async function createMsg() {

        const timestamp = new Date().toLocaleTimeString();
        const ioMsg = ` [notification -> io] ${timestamp}`;
        ioClient.sendMsg(ioMsg);

        setTimeout(createMsg, 10000);
    }

    createMsg();
}

module.exports = startNotification;
