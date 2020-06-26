import React, { useState } from 'react';

const OrderForm = ({ symbol = 'BTC', currentPrice, placeOrder }) => {
  const [ action, setAction ] = useState('buy');
  const [ quantity, setQuantity ] = useState(0);
  const [ price = currentPrice, setPrice ] = useState();

  return (
    <form>
      <h3>PLACE ORDER</h3>
      <p>{ symbol }</p>
      <select onChange={ (e) => { setAction(e.target.value) } }>
        <option value='buy'>BUY</option>
        <option value='sell'>SELL</option>
      </select>
      <input value = { quantity } onChange = { (e) => setQuantity(e.target.value) }></input>
      <input value = { price } onChange = { (e) => setPrice(e.target.value) }></input>
      <p>{ `TOTAL: $${ quantity * price }` }</p>
      <button onClick = { (e) => {
        e.preventDefault();
        placeOrder({ action, symbol, quantity, price, time: Date() });
        setAction('buy');
        setQuantity(0);
        setPrice();
      } }>Submit</button>
    </form>
  );
}

export default OrderForm;