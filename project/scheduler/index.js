const rpc_client = require('../common/rpc_client');
const rpc_server = require('../common/rpc_server');

async function startScheduler() {

    const server = new rpc_server('scheduler', async (msg) => {

        console.log(' [scheduler] Received: ', msg);
        return 'ack from scheduler';
    });

    await server.start();

    const client = new rpc_client('scheduler');
    await client.connect();

}

module.exports = startScheduler;
