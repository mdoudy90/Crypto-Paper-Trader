import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

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
    <div className = 'portfolio-container'>
      <h4>ACCOUNT OVERVIEW</h4>
      <table>
        <tr>
          <th>PORTFOLIO VALUE</th>
          <th>CASH</th>
          <th>BUYING POWER</th>
          <th>EQUITIES</th>
        </tr>
        <tr>
          <td>{ Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(portfolioValue) }</td>
          <td>{ Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(cash) }</td>
          <td>{ Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(buyingPower) }</td>
          <td>{ Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(portfolioValue - cash) }</td>
        </tr>
      </table>

      <h4>POSITIONS</h4>
      <table>
        <tr>
          <th>SYMBOL</th>
          <th>QTY</th>
          <th>VALUE</th>
        </tr>
      { Object.entries(positionsObj).map((position) => {
        return <tr>
                <td>{ position[0] }</td>
                <td>{ position[1]['qty'] }</td>
                <td>{ Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(position[1]['value']) }</td>
              </tr>
      }) }
      </table>

      <h4>OPEN ORDERS</h4>
        <table>
          <tr>
            <th>ACTION</th>
            <th>SYMBOL</th>
            <th>QTY</th>
            <th>PRICE</th>
            <th>TIME PLACED</th>
          </tr>
          { orders.map((order) => {
            if (!order.filled) {
            return (<tr>
              <td>{ order.action }</td>
              <td>{ order.symbol }</td>
              <td>{ order.quantity }</td>
              <td>{ Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(order.price) }</td>
              <td>{ moment(order.timePlaced).format('MMMM Do YYYY, h:mm:ss a') }</td>
            </tr>)};
        }) }
        </table>
      </div>
  );
}

export default Portfolio;