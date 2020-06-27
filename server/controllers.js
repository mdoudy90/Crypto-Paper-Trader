const models = require('./models');

module.exports = {

  getHistoricData: (req, res) => {
    models.apiGetHistoricData(req.params.symbol, req.params.timeScale)
      .then(({data}) => {
        res.send(data);
      })
      .catch((err) => {
        console.log('API GET ERROR: ', err);
        res.sendStatus(404);
      });
  },

  getCurrentData: (req, res) => {
    models.apiGetCurrentData(req.params.symbol)
      .then(({data}) => {
        res.send(data);
      })
      .catch((err) => {
        console.log('API GET ERROR: ', err);
        res.sendStatus(404);
      });
  },

  addUser: (req, res) => {
    models.dbAddUser(req.body)
      .then(() => {
        res.sendStatus(201);
      })
      .catch((err) => {
        console.log('DB POST ERROR: ', err);
        res.sendStatus(404);
      });
  },

  loginUser: (req, res) => {
    models.dbLoginUser(req.body)
      .then((token) => {
        console.log(token);
        res.send(token);
      })
      .catch((err) => {
        console.log('DB POST ERROR: ', err);
        res.sendStatus(404);
      });
  },

  logoutUser: (req, res) => {
    models.dbLogoutUser(req.params.token)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        console.log('DB POST ERROR: ', err);
        res.sendStatus(404);
      });
  },

  getUserData: (req, res) => {
    models.dbGetUserData(req.params.token)
      .then(([{ username, positions, orders, cashAvailable, portfolioValue }]) => {
        res.send({ username, positions, orders, cashAvailable, portfolioValue });
      })
      .catch((err) => {
        console.log('DB GET ERROR: ', err);
        res.sendStatus(404);
      });
  },

  updateUserData: (req, res) => {
    models.dbUpdateUserData(req.params.token, req.body)
      .then(() => {
        res.sendStatus(201);
      })
      .catch((err) => {
        console.log('DB GET ERROR: ', err);
        res.sendStatus(404);
      });
  },

  updateUserOrders: (req, res) => {
    models.updateUserOrders(req.params.token)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        console.log('DB ERROR: ', err);
        res.sendStatus(404);
      });
  },

  addOrder: (req, res) => {
    models.dbAddOrder(req.body)
      .then(() => {
        res.sendStatus(201);
      })
      .catch((err) => {
        console.log('DB POST ERROR: ', err);
        res.sendStatus(404);
      });
  },

  processOrders: (req, res) => {
    models.processOrders()
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        console.log('ERROR: ', err);
        res.sendStatus(404);
      });
  },

}