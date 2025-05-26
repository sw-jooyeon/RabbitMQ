const rpc_client = require('../common/rpc_client');
const rpc_server = require('../common/rpc_server');

async function startIo() {

    const server = new rpc_server('io', async (msg) => {

        console.log(' [io] Received: ', msg);
        return 'ack from io';
    });

    await server.start();

    const client = new rpc_client('io');
    await client.connect();

}

module.exports = startIo;
