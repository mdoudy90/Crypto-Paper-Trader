const apiHelpers = require('./apiHelpers');

module.exports = {
  apiGetHistoricData: (symbol, timeScale) => {
    return apiHelpers.getHistoricData(symbol, timeScale);
  }
}