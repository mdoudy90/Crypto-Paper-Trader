const controllers = require('./controllers');
const express = require('express');
const router = express.Router();

router.get('/historicData/:symbol', controllers.getHistoricData);

module.exports = router;