const express = require('express');
const app = express();
const { stopIdWorker, startIdWorker, getAllWorkerStatus } = require('./src/background/orchestrator');

const startedServerAt = new Date();

app.use(express.json());

app.post('/background/status', (req, res) => {
    res.send({ startedServerAt, workers: getAllWorkerStatus() });
});

app.post('/background/stop', (req, res) => {

    const { id } = req.body;

    stopIdWorker(id);

    res.send({ status: 'ok' });
});

app.post('/background/start', (req, res) => {

    const { id } = req.body;

    startIdWorker(id);

    res.send({ status: 'ok' });
});

app.listen(3001, () => {
    console.log('Listening on port 3001!');
});