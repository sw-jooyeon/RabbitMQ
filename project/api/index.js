const rpc_client = require('../common/rpc_client');
const rpc_server = require('../common/rpc_server');

async function startApi() {

    const server = new rpc_server('api', async (msg) => {

        console.log(' [api] Received: ', msg);
        return 'ack from api';
    });

    await server.start();

    const client = new rpc_client('api');
    await client.connect();

}

module.exports = startApi;
