const axios = require('axios');
const { API_KEY } = require('../config');
const API_HOST = 'https://min-api.cryptocompare.com/data/';

// Defaults Parameters
let limit = 2000;
let toSymbol = 'USD';
let fromSymbol = 'BTC';
let timeScale = 'day';
let timeStamp = Date.parse(new Date()) / 1000;

module.exports = {
  getHistoricData: (symbol = fromSymbol, time = timeScale, toTimestamp = timeStamp) => {
    const endPoint = `v2/histo${time}`;
    const params = `?fsym=${symbol}&tsym=${toSymbol}&limit=${limit}&toTs=${toTimestamp}&api_key=${API_KEY}`;
    const URL = `${API_HOST}${endPoint}${params}`;
    return axios.get(URL);
  },
  getCurrentData: (symbol = fromSymbol) => {
    const endPoint = 'pricemultifull';
    const params = `?fsyms=${symbol}&tsyms=${toSymbol}&api_key=${API_KEY}`;
    const URL = `${API_HOST}${endPoint}${params}`;
    return axios.get(URL);
  }
}

// &toTs=1452680400
// Date.parse(date)
// Date(new Date(1593207130000))
// new Date(1593207130000)