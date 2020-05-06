module.exports = [
    {
        id: 'GENERATE_XML',
        name: 'Geração de XML',
        delay: 300,
        service: 'generateXml',
        active: true
    },
    {
        id: 'HOMOLOGATE_NFE',
        name: 'Homologar NF-e',
        delay: 300,
        service: 'homologateNfe',
        active: true
    },
    {
        id: 'CONSULT_BATCH',
        name: 'Consulta Lote Homologação',
        delay: 1000,
        service: 'consultaBatch',
        active: true
    }
]
