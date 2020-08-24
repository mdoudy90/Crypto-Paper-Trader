import axios from 'axios';

interface Positions {
  [key: string]: number
}

export const calculatePortfolioValue = (positions: Positions, cash: number): Promise<any> => {
  let symbols = Object.keys(positions).join(',');
  let newPositionsObj = {};
  let newPortfolioValue = cash;

  return axios
    .get(`/currentData/${symbols}`)
    .then(({ data }) => {
      Object.keys(positions).forEach((symbol) => {
        newPositionsObj[symbol] = {
          qty: positions[symbol],
          value: (positions[symbol] * data.RAW[symbol].USD.PRICE).toFixed(2),
        };
        newPortfolioValue += positions[symbol] * data.RAW[symbol].USD.PRICE;
      });
      return { newPositionsObj, newPortfolioValue };
    })
    .catch((err) => {
      console.log('FETCH DATA ERROR');
    });
};
