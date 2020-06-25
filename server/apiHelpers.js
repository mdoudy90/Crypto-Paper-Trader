const axios = require('axios');
const { API_KEY } = require('../config');
const API_HOST = 'https://min-api.cryptocompare.com/data/';

// Defaults Parameters
let limit = 2000;
let toSymbol = 'USD';
let fromSymbol = 'BTC';
let timeScale = 'day';

module.exports = {
  getHistoricData: (symbol = fromSymbol, time = timeScale) => {
    const endPoint = `v2/histo${time}`;
    const params = `?fsym=${symbol}&tsym=${toSymbol}&limit=${limit}&api_key=${API_KEY}`;
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

