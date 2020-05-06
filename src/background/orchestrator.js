const { Worker } = require('worker_threads');
const path = require('path');
const workerSchema = require('./workerSchema');

var workers = {};

startAllWorkers()

module.exports.getAllWorkerStatus = function () {
    let result = {};
    for (let schema of workerSchema) {
        if (schema.active) {
            result[schema.id] = {
                ...schema,
                startedAt: workers[schema.id].startedAt,
                finishedAt: workers[schema.id].finishedAt,
                status: workers[schema.id].status,
                message: !!workers[schema.id].message ? workers[schema.id].message : null
            }
        }
    }
    return result;
}

module.exports.stopIdWorker = function (id) {
    const schema = workerSchema.find((schema) => schema.id === id);
    if (!schema.active) {
        throw Error('Worker não está ativo');
    }
    workers[id].worker.stop();
}

module.exports.startIdWorker = function (id) {
    const schema = workerSchema.find((schema) => schema.id === id);
    if (!schema.active) {
        throw Error('Worker não está ativo');
    }
    if (workers[id].status !== 'RUNNING') {
        startWorker(schema);
    }
}

function startAllWorkers() {
    for (let schema of workerSchema) {
        if (schema.active) {
            startWorker(schema);
        }
    }
}

function startWorker(schema) {
    const worker = createWorker(schema)
    workers[schema.id] = {
        ...schema,
        worker,
        status: 'RUNNING',
        startedAt: new Date(),
        finishedAt: null
    }
}

function createWorker(schema) {

    const worker = new Worker(path.resolve('src', 'background', 'worker.js'), {
        workerData: { schema }
    });

    const workerId = worker.threadId

    worker.on('online', () => {
        console.log(`-> Start Worker {${schema.id}} ID:`, workerId);
    });

    worker.on('error', (error) => {
        console.error(`<- Error Worker {${schema.id}} ID:`, workerId, ' Error:', error);
        exit(error);
    });

    worker.on('exit', () => {
        console.log(`<- Exit Worker {${schema.id}} ID:`, workerId);
        if (workers[schema.id].status !== 'CRASHED') {
            exit();
        }
    });

    worker.on('message', (msg) => {
        if (msg.action === 'ERROR') {
            console.error(`<- Error Worker {${schema.id}} ID:`, workerId, 'Error:', msg.payload);
            exit(msg.payload);
        }
    });

    function exit(error) {
        if (error) {
            workers[schema.id].status = 'CRASHED';
            workers[schema.id].message = error.message;
        } else {
            workers[schema.id].status = 'STOPPED';
        }
        workers[schema.id].finishedAt = new Date();
    }

    function stop() {
        worker.postMessage({
            action: 'STOP'
        })
    }

    return {
        state: worker,
        stop
    };
}