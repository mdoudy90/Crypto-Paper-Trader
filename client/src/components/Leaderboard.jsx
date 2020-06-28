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
        portfolioValue: user.cash,
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
    <div className = 'leaderboard-container'>
      <h4>TOP PERFORMERS</h4>
      <table>
        <tr>
            <th>USER</th>
            <th>PORTFOLIO VALUE</th>
            <th>POSITIONS</th>
        </tr>
        { board.map((user) => {
        return (<tr>
            <td>{ user.username }</td>
            <td>{ user.portfolioValue ? Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(user.portfolioValue) : 'N/A' }</td>
            <td>
            { Object.entries(user.positions).map((position) => {
              return <div>{ `${position[0]}: ${position[1]['qty']} - ${Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(position[1]['value'])}` }</div>
            }) }
            </td>
        </tr>);
        }) }
      </table>
    </div>
  );
}

export default Leaderboard;