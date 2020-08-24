import React, { useState, useEffect } from 'react';
import { calculatePortfolioValue } from '../helpers/calculatePortfolioValue';
import moment from 'moment';

interface Positions {
  [key: string]: number
}

interface Order {
  [key: string]: string | boolean
}

interface Props {
  cash: number,
  buyingPower: number,
  positions: Positions,
  orders: Order[]
}

export const Portfolio: React.FC<Props> = ({ cash, buyingPower, positions, orders }) => {
  const [portfolioValue, setPortfolioValue] = useState<number>(cash);
  const [positionsObj, setPositionsObj] = useState<Positions>({});
  const [openOrders, setOpenOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (Object.keys(positions).length) {
      calculatePortfolioValue(positions, cash)
        .then(({ newPositionsObj, newPortfolioValue }) => {
          setPositionsObj(newPositionsObj);
          setPortfolioValue(newPortfolioValue);
        })
    }
    setOpenOrders(orders.filter((order) => !order.filled));
  }, [positions]);

  return (
    <div className='portfolio-container'>
      <h4>ACCOUNT OVERVIEW</h4>
      <table>
        <thead>
          <tr>
            <th>PORTFOLIO VALUE</th>
            <th>CASH</th>
            <th>BUYING POWER</th>
            <th>EQUITIES</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(portfolioValue)}</td>
            <td>{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cash)}</td>
            <td>{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(buyingPower)}</td>
            <td>{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(portfolioValue - cash)}</td>
          </tr>
        </tbody>
      </table>
      {Object.keys(positionsObj).length ?
        <>
          <h4>POSITIONS</h4>
          <table>
            <thead>
              <tr>
                <th>SYMBOL</th>
                <th>QTY</th>
                <th>VALUE</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(positionsObj).map((position, i) => {
                return <tr key={i}>
                  <td>{position[0]}</td>
                  <td>{position[1]['qty']}</td>
                  <td>{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(position[1]['value'])}</td>
                </tr>
              })}
            </tbody>
          </table>
        </> : null
      }
      {openOrders.length ?
        <>
          <h4>OPEN ORDERS</h4>
          <table>
            <thead>
              <tr>
                <th>ACTION</th>
                <th>SYMBOL</th>
                <th>QTY</th>
                <th>PRICE</th>
                <th>TIME PLACED</th>
              </tr>
            </thead>
            <tbody>
              {openOrders.map((order, i) => {
                return (<tr key={i}>
                  <td>{order.action}</td>
                  <td>{order.symbol}</td>
                  <td>{order.quantity}</td>
                  <td>{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(order.price))}</td>
                  <td>{moment(String(order.timePlaced)).format('MMMM Do YYYY, h:mm:ss a')}</td>
                </tr>)
              })}
            </tbody>
          </table>
        </> : null
      }
    </div>
  );
}