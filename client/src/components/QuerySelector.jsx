import React, { useState } from 'react';

const QuerySelector = ({ fetchHistoricData }) => {
  const [symbol, setSymbol] = useState('BTC');
  const [timeScale, setTimeScale] = useState('day');

  return (
    <div>
      <select onChange={ (e) => {
        setSymbol(e.target.value);
        fetchHistoricData(e.target.value, timeScale);
        }}>
        <option value='BTC'>BTC</option>
        <option value='ETH'>ETH</option>
        <option value='XRP'>XRP</option>
        <option value='LTC'>LTC</option>
      </select>
      <select onChange={ (e) => {
        setTimeScale(e.target.value);
        fetchHistoricData(symbol, e.target.value);
        }}>
        <option value='day'>Daily</option>
        <option value='hour'>Hourly</option>
        <option value='minute'>Minute</option>
      </select>
    </div>
  );
}

export default QuerySelector;