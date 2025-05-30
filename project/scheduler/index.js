const rpcClient = require('../common/rpc_client');
const rpcServer = require('../common/rpc_server');

async function handleMessage(msg) {

    const response = ` ${msg} 요청을 [scheduler]에서 받았습니다.`;
    
    return response;
}

async function startScheduler() {

    const server = new rpcServer('rpc.queue.scheduler', handleMessage);
    await server.init();

    const apiClient = new rpcClient('rpc.queue.api');
    const notificationClient = new rpcClient('rpc.queue.notification');

    await apiClient.init();
    await notificationClient.init();

    async function createMsg() {
        
        const timestamp = new Date().toLocaleTimeString();

        const apiMsg = ` [scheduler -> api] ${timestamp}`;
        const notificationMsg = ` [scheduler -> notification] ${timestamp}`;

        apiClient.sendMsg(apiMsg);
        notificationClient.sendMsg(notificationMsg);

        setTimeout(createMsg, 10000);
    }

    createMsg();
}

module.exports = startScheduler;
