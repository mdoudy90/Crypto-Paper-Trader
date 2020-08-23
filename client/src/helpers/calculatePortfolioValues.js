import axios from 'axios';

export const calculatePortfolioValues = (users) => {
  let newBoard = [];
  let symbols = {};

  users.forEach((user) => {
    let userBoardObj = {
      username: user.username,
      portfolioValue: user.cash,
      positions: { ...user.positions } || {},
    };
    symbols = { ...symbols, ...user.positions };
    newBoard.push(userBoardObj);
  });

  symbols = Object.keys(symbols).join(',');

  return axios
    .get(`/currentData/${symbols}`)
    .then(({ data }) => {
      newBoard.forEach((user) => {
        Object.keys(user.positions).forEach((symbol) => {
          user.positions[symbol] = {
            qty: user.positions[symbol],
            value: (user.positions[symbol] * data.RAW[symbol].USD.PRICE).toFixed(2),
          };
          user.portfolioValue += user.positions[symbol].qty * data.RAW[symbol].USD.PRICE;
        });
      });
      newBoard.sort((a, b) => b.portfolioValue - a.portfolioValue);
      return newBoard;
    })
    .catch((err) => {
      console.log('FETCH DATA ERROR');
      return [];
    });
};
