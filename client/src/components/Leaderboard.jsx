import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = ({ users }) => {
  const [ board, setBoard ] = useState([]);
  const calculatePortfolioValues = () => {
    let newBoard = [];
    let symbols = {};

    users.forEach((user) => {
      let userBoardObj = {
        username: user.username,
        portfolioValue: user.cashAvailable,
        positions: { ...user.positions } || {},
      };
      symbols = { ...symbols, ...user.positions };

      newBoard.push(userBoardObj);
    })

    symbols = Object.keys(symbols).join(',');

    axios.get(`/currentData/${symbols}`)
    .then(({data}) => {

      newBoard.forEach((user) => {
        Object.keys(user.positions).forEach((symbol) => {
          user.positions[symbol] = { qty: user.positions[symbol] , value: (user.positions[symbol] * data.RAW[symbol].USD.PRICE).toFixed(2) };
          user.portfolioValue += user.positions[symbol].qty * data.RAW[symbol].USD.PRICE;
        })
      })

      newBoard.sort((a, b) => b.portfolioValue - a.portfolioValue);
      setBoard(newBoard);
    })
    .catch((err) => {
      console.log('FETCH DATA ERROR');
    })
  }

  useEffect(() => {
    users.length ? calculatePortfolioValues() : null;
  },[users]);

  return (
    <div>
      { board.map((user) => {
      return (<div>
        <div>
          <h4>Username</h4>
          <p>{ user.username }</p>
        </div>
        <div>
          <h4>Portfolio Value</h4>
          <p>${ user.portfolioValue.toFixed(2) }</p>
        </div>
        <div>
          <h4>Positions</h4>
          { Object.entries(user.positions).map((position) => {
            return <div>{ `${position[0]}: ${position[1]['qty']} - $${position[1]['value']}` }</div>
          }) }
        </div>
        <p>-----------</p>
        <br></br>
      </div>);
      }) }

    </div>
  );
}

export default Leaderboard;