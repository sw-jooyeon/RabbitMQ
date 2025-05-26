const rpc_client = require('../common/rpc_client');
const rpc_server = require('../common/rpc_server');

async function startNotification() {

    const server = new rpc_server('notification', async (msg) => {

        console.log(' [notification] Received: ', msg);
        return 'ack from notification';
    });

    await server.start();

    const client = new rpc_client('notification');
    await client.connect();

}

module.exports = startNotification;
