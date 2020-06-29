import React, { useState } from 'react';

const OrderForm = ({ symbol = 'BTC', currentPrice, buyingPower, placeOrder, positions }) => {
  const [ action, setAction ] = useState('buy');
  const [ quantity, setQuantity ] = useState(0);
  const [ price = currentPrice, setPrice ] = useState();

  let total = quantity * price;
  const handleClick = (e) => {
    e.preventDefault();
    if (action === 'buy' && total > buyingPower) {
      alert('Not enough buying power');
      return;
    }
    if (action === 'sell' && (!positions[symbol] || positions[symbol] < quantity) ) {
      alert('Sell order qty is more than portfolio qty');
      return;
    }
    placeOrder({ action, symbol, quantity, price, timePlaced: Date() }, total);
    setAction('buy');
    setQuantity(0);
    setPrice();
  }

  return (
    <form className='user-form order-form'>
      <h2>PLACE ORDER</h2>
      <p>SYMBOL: { symbol }</p>
      <select onChange={ (e) => { setAction(e.target.value) } }>
        <option value='buy'>BUY</option>
        <option value='sell'>SELL</option>
      </select>
      <input value = { quantity } onChange = { (e) => setQuantity(e.target.value) }></input>
      <input value = { price } onChange = { (e) => setPrice(e.target.value) }></input>
      <p>{ `TOTAL: ${ Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(total) }` }</p>
      <button onClick = { handleClick }>Submit</button>
    </form>
  );
}

export default OrderForm;