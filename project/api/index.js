const rpcClient = require('../common/rpc_client');
const rpcServer = require('../common/rpc_server');

async function handleMessage(msg) {

    const response = ` ${msg} 요청을 [api]에서 받았습니다.`;
    
    return response;
}

async function startApi() {
    
    const server = new rpcServer('rpc.queue.api', handleMessage);
    await server.init();

    const ioClient = new rpcClient('rpc.queue.io');
    const schedulerClient = new rpcClient('rpc.queue.scheduler');
    const notificationClient = new rpcClient('rpc.queue.notification');

    await ioClient.init();
    await schedulerClient.init();
    await notificationClient.init();

    async function createMsg() {
        
        const timestamp = new Date().toLocaleTimeString();

        const ioMsg = ` [api -> io] ${timestamp}`;
        const schedulerMsg = ` [api -> scheduler] ${timestamp}`;
        const notificationMsg = ` [api -> notification] ${timestamp}`;

        ioClient.sendMsg(ioMsg);
        schedulerClient.sendMsg(schedulerMsg);
        notificationClient.sendMsg(notificationMsg);

        setTimeout(createMsg, 10000);
    }

    createMsg();
}

module.exports = startApi;
