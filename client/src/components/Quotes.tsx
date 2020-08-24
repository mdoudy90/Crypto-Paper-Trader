import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

interface Props {
  lastDataCallReference: number
}

export const Quotes: React.FC<Props> = ({ lastDataCallReference }) => {
  const [filledOrders, setFilledOrders] = useState<{ [key: string]: any }[]>([]);
  const [openOrders, setOpenOrders] = useState<{ [key: string]: any }[]>([]);

  useEffect(() => {
    axios
      .get('/orders')
      .then(({ data }) => {
        data.sort((a, b) => Date.parse(b.timePlaced) - Date.parse(a.timePlaced));
        setFilledOrders(data.filter((order) => order.filled));
        setOpenOrders(data.filter((order) => !order.filled));
      })
      .catch((err) => {
        console.log('ORDER FETCH UNSUCCESSFUL');
      });
  }, [lastDataCallReference]);

  return (
    <div className='quotes-container'>
      <h4>OPEN ORDERS</h4>
      <table>
        <thead>
          <tr>
            <th>ACTION</th>
            <th>SYMBOL</th>
            <th>QTY</th>
            <th>PRICE</th>
            <th>TIME PLACED</th>
            <th>USER</th>
          </tr>
        </thead>
        <tbody>
          {openOrders.map((order, i) => {
            return (
              <tr key={i}>
                <td>{order.action}</td>
                <td>{order.symbol}</td>
                <td>{order.quantity}</td>
                <td>{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.price)}</td>
                <td>{moment(order.timePlaced).format('MMMM Do YYYY, h:mm:ss a')}</td>
                <td>{order.username}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h4>FILLED ORDERS</h4>
      <table>
        <thead>
          <tr>
            <th>ACTION</th>
            <th>SYMBOL</th>
            <th>QTY</th>
            <th>PRICE</th>
            <th>TIME PLACED</th>
            <th>TIME FILLED</th>
            <th>USER</th>
          </tr>
        </thead>
        <tbody>
          {filledOrders.map((order, i) => {
            return (
              <tr key={i}>
                <td>{order.action}</td>
                <td>{order.symbol}</td>
                <td>{order.quantity}</td>
                <td>{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.price)}</td>
                <td>{moment(order.timePlaced).format('MMMM Do YYYY, h:mm:ss a')}</td>
                <td>{moment(order.timeFilled).format('MMMM Do YYYY, h:mm:ss a')}</td>
                <td>{order.username}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};