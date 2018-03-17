const extractJson = require('./extract-json');
const isNumeric = require('./is-numeric');

module.exports = function buildSource(message, extractedFields) {
    let jsonSubString = null;
    if (extractedFields) {
        const source = {};

        for (const key in extractedFields) {
            if (extractedFields.hasOwnProperty(key) && extractedFields[key]) {
                const value = extractedFields[key];

                if (isNumeric(value)) {
                    source[key] = Number(value);
                    continue;
                }

                jsonSubString = extractJson(value);
                if (jsonSubString !== null) {
                    source[`$${ key}`] = JSON.parse(jsonSubString);
                }

                source[key] = value;
            }
        }
        return source;
    }

    jsonSubString = extractJson(message);
    if (jsonSubString !== null) {
        return JSON.parse(jsonSubString);
    }

    return {};
};
