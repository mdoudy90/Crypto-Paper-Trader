const models = require('./models');

module.exports = {

  getHistoricData: (req, res) => {
    let symbol = req.params.symbol;
    models.apiGetHistoricData(symbol)
      .then(({data}) => {
        res.send(data);
      })
      .catch((err) => {
        console.log('API GET ERROR: ', err);
        res.sendStatus(404);
      });
  }

}