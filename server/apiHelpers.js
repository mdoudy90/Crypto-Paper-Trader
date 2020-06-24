const axios = require('axios');
const { API_KEY } = require('../config');
const API_HOST = 'https://min-api.cryptocompare.com/data/';

// Defaults Parameters
let limit = 2000;
let toSymbol = 'USD';
let fromSymbol = 'BTC';

module.exports = {
  getHistoricData: (fromSymbol) => {
    const endPoint = 'v2/histoday';
    const params = `?fsym=${fromSymbol}&tsym=${toSymbol}&limit=${limit}&api_key=${API_KEY}`;
    const URL = `${API_HOST}${endPoint}${params}`;
    return axios.get(URL);
  }
}