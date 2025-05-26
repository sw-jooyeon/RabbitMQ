const startApi = require('./api');
const startIo = require('./io');
const startScheduler = require('./scheduler');
const startNotification = require('./notification');

async function startAll() {

    await Promise.all([

        startApi(),
        startIo(),
        startScheduler(),
        startNotification()
    ]);
    
    console.log('All servers started.');

}

startAll();
