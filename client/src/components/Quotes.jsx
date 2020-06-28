import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quotes = ({ lastDataCallReference }) => {
  const [ orders, setOrders ] = useState([]);

  useEffect(() => {
    axios.get('/orders').then(({data}) => {
      setOrders(data);
    }).catch((err) => {
      console.log('ORDER FETCH UNSUCCESSFUL');
    })
  }, [lastDataCallReference]);

  return (
    <div>
        <h4>Market Orders</h4>
        { orders.map((order) => {
            return (<>
              <div>{ order.filled ? 'Filled order' : 'Open order' }</div>
              <div>{ `Action: ${order.action}` }</div>
              <div>{ `Symbol: ${order.symbol}` }</div>
              <div>{ `Quantity: ${order.quantity}` }</div>
              <div>{ `Price: ${order.price}` }</div>
              <div>{ `Time Placed: ${order.timePlaced}` }</div>
              <div>{ `Time Filled: ${order.timeFilled ? order.timeFilled : 'N/A'}` }</div>
              <div>{ `User: ${order.username}` }</div>
              <br></br>
            </>);
        }) }
    </div>
  );
}

export default Quotes;