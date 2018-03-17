const isValidJson = require('./is-valid-json');

module.exports = function extractJson(message) {
    const jsonStart = message.indexOf('{');
    if (jsonStart < 0) return null;
    const jsonSubString = message.substring(jsonStart);
    return isValidJson(jsonSubString) ? jsonSubString : null;
};
