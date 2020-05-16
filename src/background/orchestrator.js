const { Worker } = require('worker_threads');
const path = require('path');
const workerSchema = require('./workerSchema');

var workers = {};
var socketInstance = null;

startAllWorkers()

function getAllWorkerStatus() {
    let result = [];
    for (let schema of workerSchema) {
        if (schema.active) {
            let workerActive = workers[schema.id];
            result.push({
                ...schema,
                startedAt: workerActive ? workerActive.startedAt : null,
                finishedAt: workerActive ? workerActive.finishedAt : null,
                status: workerActive ? workerActive.status : 'STOPPED',
                message: workerActive ? (!!workerActive.message ? workerActive.message : null) : null
            })
        }
    }
    return result;
}

function setIoInstance(io) {
    socketInstance = io;
}

function stopIdWorker(id) {
    const schema = workerSchema.find((schema) => schema.id === id);
    if (!schema) {
        throw Error(`Worker ${id} não existe`);
    }
    if (!schema.active) {
        throw Error('Worker não está ativo');
    }
    workers[id].worker.stop();
}

function startIdWorker(id) {
    const schema = workerSchema.find((schema) => schema.id === id);
    if (!schema) {
        throw Error(`Worker ${id} não existe`);
    }
    if (!schema.active) {
        throw Error('Worker não está ativo');
    }
    if (workers[id] === undefined || workers[id].status !== 'RUNNING') {
        startWorker(schema);
    }
}

module.exports.Workers = {
    getAllWorkerStatus,
    setIoInstance,
    stopIdWorker,
    startIdWorker
}

function updatedWorkerStatus() {
    if (socketInstance !== null) {
        socketInstance.emit("workersStatus", {
            workers: getAllWorkerStatus(),
        });
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
        status: 'STARTING',
        startedAt: new Date(),
        finishedAt: null
    }
    updatedWorkerStatus();
}

function createWorker(schema) {

    const worker = new Worker(path.resolve('src', 'background', 'worker.js'), {
        workerData: { schema }
    });

    const workerId = worker.threadId

    /*worker.on('online', () => {
        console.log(`-> Start Worker {${schema.id}} ID:`, workerId);
    });*/

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
        } else if (msg.action === 'RUNNING') {
            console.info(`-> Start Worker {${schema.id}} ID:`, workerId);
            workers[schema.id].status = 'RUNNING';
            workers[schema.id].message = null
            updatedWorkerStatus();
        } else if (msg.action === 'STOPPING') {
            workers[schema.id].status = 'STOPPING';
            workers[schema.id].message = null
            updatedWorkerStatus();
        }
    });

    function exit(error) {
        if (error) {
            workers[schema.id].status = 'CRASHED';
            workers[schema.id].message = error.message;
        } else {
            workers[schema.id].status = 'STOPPED';
            workers[schema.id].message = null
        }
        workers[schema.id].finishedAt = new Date();
        updatedWorkerStatus();
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