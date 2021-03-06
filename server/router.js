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
router.get('/users', controllers.getAllUsers);

router.post('/orders', controllers.addOrder);
router.get('/orders', controllers.getOrders);
router.post('/orders/process', controllers.processOrders);

module.exports = router;