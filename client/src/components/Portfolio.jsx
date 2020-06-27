import React, { useState } from 'react';

const Portfolio = ({ cashAvailable, positions, orders }) => {

  return (
    <div>
      <div>
        <h4>Cash available</h4>
        <p>{ cashAvailable }</p>
      </div>
      <div>
        <h4>Positions</h4>
        { Object.entries(positions).map((position) => {
          return <div>{ `${position[0]}: ${position[1]}` }</div>
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
              <div>{ `Time Place: ${order.timePlaced}` }</div>
            </>);
          }
        }) }
      </div>
    </div>
  );
}

export default Portfolio;