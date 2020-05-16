const Knex = require('../database');

module.exports.exec = async function () {
    try {
        const invoiceXml = await Knex('filanotafiscal').where({ status: 1, fase: 1 });
        //throw Error('Falha esquema XML')
    } catch (error) {
        console.log(error)
        throw error;
    }

}