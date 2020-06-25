const controllers = require('./controllers');
const express = require('express');
const router = express.Router();

router.get('/historicData/:symbol/:timeScale', controllers.getHistoricData);
router.get('/currentData/:symbol', controllers.getCurrentData);

module.exports = router;