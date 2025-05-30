const startApi = require('./api');
const startIo = require('./io');
const startScheduler = require('./scheduler');
const startNotification = require('./notification');

async function startAll() {

    console.log('모든 서버를 실행합니다.');
    
    await Promise.all([

        startApi(),
        startIo(),
        startScheduler(),
        startNotification()
    ]);

}

startAll();
