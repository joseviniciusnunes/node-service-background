module.exports = [
    {
        id: 'GENERATE_XML_NFE',
        name: 'Gerar XML NF-e',
        delay: 300,
        service: 'generateXml',
        active: true
    },
    {
        id: 'SEND_BATCH_NFE',
        name: 'Enviar Lote NF-e',
        delay: 300,
        service: 'homologateNfe',
        active: true
    },
    {
        id: 'CONSULT_BATCH_NFE',
        name: 'Consulta Lote NF-e',
        delay: 1000,
        service: 'consultaBatch',
        active: true
    },
    {
        id: 'GENERATE_XML_EVENT',
        name: 'Gerar XML Evento',
        delay: 1000,
        service: 'consultaBatch',
        active: true
    },
    {
        id: 'SEND_BATCH_EVENT',
        name: 'Enviar Lote Evento',
        delay: 1000,
        service: 'consultaBatch',
        active: true
    },
    {
        id: 'GENERATE_DANFE',
        name: 'Gerar DANFE',
        delay: 1000,
        service: 'consultaBatch',
        active: true
    },
    {
        id: 'SEND_MAIL',
        name: 'Enviar E-mail',
        delay: 1000,
        service: 'consultaBatch',
        active: true
    },
    {
        id: 'CONSULT_DFE',
        name: 'Distribuição DF-e',
        delay: 5000,
        service: 'consultaBatch',
        active: true
    }
]
