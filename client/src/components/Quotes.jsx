import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const Quotes = ({ lastDataCallReference }) => {
  const [ filledOrders, setFilledOrders ] = useState([]);
  const [ openOrders, setOpenOrders ] = useState([]);

  useEffect(() => {
    axios.get('/orders').then(({data}) => {
      data.sort((a, b) => Date.parse(b.timePlaced) - Date.parse(a.timePlaced));
      setFilledOrders(data.filter((order) => order.filled));
      setOpenOrders(data.filter((order) => !order.filled));
    }).catch((err) => {
      console.log('ORDER FETCH UNSUCCESSFUL');
    })
  }, [lastDataCallReference]);

  return (
    <div className = 'quotes-container'>
        <h4>Open Orders</h4>
        <table>
          <tr>
            <th>ACTION</th>
            <th>SYMBOL</th>
            <th>QTY</th>
            <th>PRICE</th>
            <th>TIME PLACED</th>
            <th>USER</th>
          </tr>
          { openOrders.map((order) => {
            return (<tr>
              <td>{ order.action }</td>
              <td>{ order.symbol }</td>
              <td>{ order.quantity }</td>
              <td>{ Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(order.price) }</td>
              <td>{ moment(order.timePlaced).format('MMMM Do YYYY, h:mm:ss a') }</td>
              <td>{ order.username }</td>
            </tr>);
        }) }
        </table>

        <h4>Filled Orders</h4>
        <table>
          <tr>
            <th>ACTION</th>
            <th>SYMBOL</th>
            <th>QTY</th>
            <th>PRICE</th>
            <th>TIME PLACED</th>
            <th>TIME FILLED</th>
            <th>USER</th>
          </tr>
          { filledOrders.map((order) => {
            return (<tr>
              <td>{ order.action }</td>
              <td>{ order.symbol }</td>
              <td>{ order.quantity }</td>
              <td>{ Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(order.price) }</td>
              <td>{ moment(order.timePlaced).format('MMMM Do YYYY, h:mm:ss a') }</td>
              <td>{ moment(order.timeFilled).format('MMMM Do YYYY, h:mm:ss a') }</td>
              <td>{ order.username }</td>
            </tr>);
        }) }
        </table>

    </div>
  );
}

export default Quotes;