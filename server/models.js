const apiHelpers = require('./apiHelpers');

module.exports = {
  apiGetHistoricData: (symbol) => {
    return apiHelpers.getHistoricData(symbol);
  }
}