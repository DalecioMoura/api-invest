const express = require('express');
const router = express.Router();
const { getQuotes } = require('../controllers/brapiController');
const { getHistoricalData } = require('../controllers/yahooFinanceController');

router.get('/stocks/quotes', getQuotes);
router.get('/stocks/yahoofinance', getHistoricalData);

module.exports = router;


