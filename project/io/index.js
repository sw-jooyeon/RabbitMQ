const rpcClient = require('../common/rpc_client');
const rpcServer = require('../common/rpc_server');

async function handleMessage(msg) {

    const response = ` ${msg} 요청을 [io]에서 받았습니다.`;
    
    return response;
}

async function startIo() {

    const server = new rpcServer('rpc.queue.io', handleMessage);
    await server.init();

    const apiClient = new rpcClient('rpc.queue.api');
    const notificationClient = new rpcClient('rpc.queue.notification');

    await apiClient.init();
    await notificationClient.init();

    async function createMsg() {
        
        const timestamp = new Date().toLocaleTimeString();

        const apiMsg = ` [io -> api] ${timestamp}`;
        const notificationMsg = ` [io -> notification] ${timestamp}`;

        apiClient.sendMsg(apiMsg);
        notificationClient.sendMsg(notificationMsg);

        setTimeout(createMsg, 10000);
    }

    createMsg();
}

module.exports = startIo;
