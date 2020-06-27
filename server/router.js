const controllers = require('./controllers');
const express = require('express');
const router = express.Router();

router.get('/historicData/:symbol/:timeScale', controllers.getHistoricData);
router.get('/currentData/:symbol', controllers.getCurrentData);

router.post('/users', controllers.addUser);
router.post('/users/login', controllers.loginUser);
router.post('/users/logout/:token', controllers.logoutUser);
router.post('/users/data/:token', controllers.updateUserData);
router.get('/users/data/:token', controllers.getUserData);
router.post('/users/orders/:token', controllers.updateUserOrders);

router.post('/orders', controllers.addOrder);
router.post('/orders/process', controllers.processOrders);

module.exports = router;

// upon user login
  // sends user orders data to backend
  // runs check against orders db
    // iterates through user orders and checks each in orders db
    // if order was filled, update user db accordingly
      // add/subtract to portfolio
      // add/subtract to cash
    // update user orders data to filled
    // send back new data to user (which will update state)