import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Portfolio = ({ cash, buyingPower, positions, orders }) => {
  const [ portfolioValue, setPortfolioValue ] = useState(cash);
  const [ positionsObj, setPositionsObj ] = useState({});

  const calculatePortfolioValue = () => {
    let symbols = Object.keys(positions).join(',');
    let newPositionsObj = {};
    let newPortfolioValue = cash;

    axios.get(`/currentData/${symbols}`)
    .then(({data}) => {
      Object.keys(positions).forEach((symbol) => {
        newPositionsObj[symbol] = { qty: positions[symbol] , value: (positions[symbol] * data.RAW[symbol].USD.PRICE).toFixed(2) };
        newPortfolioValue += positions[symbol] * data.RAW[symbol].USD.PRICE;
      })
      setPositionsObj(newPositionsObj);
      setPortfolioValue(newPortfolioValue);
    })
    .catch((err) => {
      console.log('FETCH DATA ERROR');
    })
  }

  useEffect(() => {
    Object.keys(positions).length ? calculatePortfolioValue() : null;
  },[positions]);

  return (
    <div>
      <div>
        <h4>Portfolio Value</h4>
        <p>${ portfolioValue.toFixed(2) }</p>
      </div>
      <div>
        <h4>Cash</h4>
        <p>${ cash.toFixed(2) }</p>
      </div>
      <div>
        <h4>Buying Power</h4>
        <p>${ buyingPower.toFixed(2) }</p>
      </div>
      <div>
        <h4>Positions</h4>
        { Object.entries(positionsObj).map((position) => {
          return <div>{ `${position[0]}: ${position[1]['qty']} - $${position[1]['value']}` }</div>
        }) }
      </div>
      <div>
        <h4>Unfilled Orders</h4>
        { orders.map((order) => {
          if (!order.filled) {
            return (<>
              <div>{ `Action: ${order.action}` }</div>
              <div>{ `Symbol: ${order.symbol}` }</div>
              <div>{ `Quantity: ${order.quantity}` }</div>
              <div>{ `Price: ${order.price}` }</div>
              <div>{ `Time Placed: ${order.timePlaced}` }</div>
            </>);
          }
        }) }
      </div>
    </div>
  );
}

export default Portfolio;