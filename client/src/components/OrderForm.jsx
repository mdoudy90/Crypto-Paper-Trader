import React, { useState } from 'react';

const OrderForm = ({ symbol = 'BTC', currentPrice, cashAvailable, placeOrder, positions }) => {
  const [ action, setAction ] = useState('buy');
  const [ quantity, setQuantity ] = useState(0);
  const [ price = currentPrice, setPrice ] = useState();

  let total = quantity * price;
  const handleClick = (e) => {
    e.preventDefault();
    if (total > cashAvailable) {
      alert('Not enough cash');
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
    <form>
      <h3>PLACE ORDER</h3>
      <p>{ symbol }</p>
      <select onChange={ (e) => { setAction(e.target.value) } }>
        <option value='buy'>BUY</option>
        <option value='sell'>SELL</option>
      </select>
      <input value = { quantity } onChange = { (e) => setQuantity(e.target.value) }></input>
      <input value = { price } onChange = { (e) => setPrice(e.target.value) }></input>
      <p>{ `TOTAL: $${ total }` }</p>
      <button onClick = { handleClick }>Submit</button>
    </form>
  );
}

export default OrderForm;