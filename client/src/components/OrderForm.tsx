import React, { useState } from 'react';

interface Props {
  symbol: string,
  currentPrice: number,
  buyingPower: number,
  placeOrder: (obj: {}, total: number) => void,
  positions: { symbol: number } | {}
}

export const OrderForm: React.FC<Props> = ({ symbol = 'BTC', currentPrice, buyingPower, placeOrder, positions }) => {
  const [action, setAction] = useState<string>('buy');
  const [quantity, setQuantity] = useState<number>(0);
  const [price = currentPrice, setPrice] = useState<number | undefined>();
  let total = quantity * price;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (action === 'buy' && total > buyingPower) {
      alert('Not enough buying power');
      return;
    }
    if (action === 'sell' && (!positions[symbol] || positions[symbol] < quantity)) {
      alert('Sell order qty is more than portfolio qty');
      return;
    }
    placeOrder({ action, symbol, quantity, price, timePlaced: Date() }, total);
    setAction('buy');
    setQuantity(0);
    setPrice(undefined);
  }

  return (
    <form className='user-form order-form'>
      <h2>PLACE ORDER</h2>
      <p>SYMBOL: {symbol}</p>
      <select onChange={(e) => { setAction(e.target.value) }}>
        <option value='buy'>BUY</option>
        <option value='sell'>SELL</option>
      </select>
      <input
        value={quantity}
        onChange={(e) => setQuantity(!isNaN(Number(e.target.value)) ? Number(e.target.value) : quantity)}
      />
      <input
        value={price}
        onChange={(e) => setPrice(!isNaN(Number(e.target.value)) ? Number(e.target.value) : price)}
      />
      <p>{`TOTAL: ${Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}`}</p>
      <button onClick={handleClick}>Submit</button>
    </form>
  );
}