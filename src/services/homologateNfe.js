const Knex = require('../database');

module.exports.exec = async function () {
    try {
        const invoiceXml = await Knex('filanotafiscal').where({ status: 2, fase: 2 });
    } catch (error) {
        console.log(error)
        throw error;
    }

}