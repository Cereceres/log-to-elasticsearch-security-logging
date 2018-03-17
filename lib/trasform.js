const buildSource = require('./build-source');


const { PREFIX: prefix = 'cwl' } = process.env;

module.exports = function transform(payload) {
    if (payload.messageType === 'CONTROL_MESSAGE') {
        return null;
    }

    let bulkRequestBody = '';

    payload.logEvents.forEach((logEvent) => {
        const timestamp = new Date(Number(logEvent.timestamp));

        // index name format: cwl-YYYY.MM.DD
        const indexName = [
            `${prefix}-${ timestamp.getUTCFullYear()}`, // year
            `0${ timestamp.getUTCMonth() + 1}`.slice(-2), // month
            `0${ timestamp.getUTCDate()}`.slice(-2) // day
        ].join('.');

        const source = buildSource(logEvent.message, logEvent.extractedFields);
        source['@id'] = logEvent.id;
        source['@timestamp'] = new Date(Number(logEvent.timestamp)).toISOString();
        source['@message'] = logEvent.message;
        source['@owner'] = payload.owner;
        source['@log_group'] = payload.logGroup;
        source['@log_stream'] = payload.logStream;

        const action = { index: {} };
        action.index._index = indexName;
        action.index._type = payload.logGroup;
        action.index._id = logEvent.id;

        bulkRequestBody = `${bulkRequestBody }${[
            JSON.stringify(action),
            JSON.stringify(source),
        ].join('\n') }\n`;
    });
    return bulkRequestBody;
};
