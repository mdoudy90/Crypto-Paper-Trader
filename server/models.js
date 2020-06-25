const apiHelpers = require('./apiHelpers');

module.exports = {
  apiGetHistoricData: (symbol, timeScale) => apiHelpers.getHistoricData(symbol, timeScale),
  apiGetCurrentData: (symbol) => apiHelpers.getCurrentData(symbol)
}