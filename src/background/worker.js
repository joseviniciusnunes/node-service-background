const { parentPort, threadId, workerData } = require('worker_threads');
const { exec } = require(`../services/${workerData.schema.service}`);

parentPort.postMessage({
    action: 'RUNNING'
});

parentPort.on('message', (msg) => {
    if (msg.action === 'STOP') {
        stopped = true;
        parentPort.postMessage({
            action: 'STOPPING'
        });
    }
});

var stopped = false;

setInterval(startWorker, workerData.schema.delay);

async function startWorker() {
    try {

        if (stopped) {
            process.exit(0);
        }

        await exec();

    } catch (error) {
        parentPort.postMessage({
            action: 'ERROR',
            payload: error
        })
        process.exit(-1);
    }
}
