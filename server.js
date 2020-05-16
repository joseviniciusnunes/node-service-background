const app = require('express')();
const { json } = require('express');
const cors = require('cors');
const http = require('http').Server(app);
const io = require('socket.io')(http);

const { Workers } = require('./src/background/orchestrator');

app.use(cors());
app.use(json());

app.post('/background/status', (req, res) => {
    res.send({ workers: Workers.getAllWorkerStatus() });
});

app.post('/background/stop', (req, res) => {

    const { id } = req.body;

    Workers.stopIdWorker(id);

    res.send({ status: 'ok' });
});

app.post('/background/start', (req, res) => {

    const { id } = req.body;

    Workers.startIdWorker(id);

    res.send({ status: 'ok' });
});

io.on("connection", (client) => {

    console.log('Client connected (ID:', client.id, ')');

    client.emit("workersStatus", {
        workers: Workers.getAllWorkerStatus(),
    });

    client.on("disconnect", () => {
        console.log("Client disconnected (ID", client.id, ')');
    });

});

Workers.setIoInstance(io);

http.listen(3001, () => {
    console.log('Listening on port 3001!');
});