const Knex = require('knex');

const { isMainThread } = require('worker_threads');

function afterCreate(conn, cb) {
    conn.query('select connection_id() id;', (err, response) => {
        if (!err) {
            console.info('Connect to database! Thread ID:', response[0].id);
        }
    });
    cb(null, conn);
}

const poolWeb = {
    min: 1,
    max: 5,
    afterCreate
}

const poolWorker = {
    min: 1,
    max: 1,
    afterCreate
}

const config = {
    client: 'mysql2',
    connection: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'sentinel'
    },
    pool: isMainThread ? poolWeb : poolWorker,
    //debug: true
}

const pool = Knex(config);
module.exports = pool;