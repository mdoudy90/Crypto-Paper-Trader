const models = require('./models');

module.exports = {

  getHistoricData: (req, res) => {
    let symbol = req.params.symbol;
    let timeScale = req.params.timeScale;

    models.apiGetHistoricData(symbol, timeScale)
      .then(({data}) => {
        res.send(data);
      })
      .catch((err) => {
        console.log('API GET ERROR: ', err);
        res.sendStatus(404);
      });
  },

  getCurrentData: (req, res) => {
    let symbol = req.params.symbol;

    models.apiGetCurrentData(symbol)
      .then(({data}) => {
        res.send(data);
      })
      .catch((err) => {
        console.log('API GET ERROR: ', err);
        res.sendStatus(404);
      });
  }

}