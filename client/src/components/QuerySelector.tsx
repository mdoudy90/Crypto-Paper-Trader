import React, { useState } from 'react';

interface Props {
  fetchAllData: (symbol: string, timeScale: string) => void
}

export const QuerySelector: React.FC<Props> = ({ fetchAllData }) => {
  const [symbol, setSymbol] = useState<string>('BTC');
  const [timeScale, setTimeScale] = useState<string>('day');

  return (
    <div className='query-selector-container'>
      <select onChange={(e) => {
        setSymbol(e.target.value);
        fetchAllData(e.target.value, timeScale);
      }}>
        <option value='BTC'>BTC</option>
        <option value='ETH'>ETH</option>
        <option value='XRP'>XRP</option>
        <option value='LTC'>LTC</option>
        <option value='BCH'>BCH</option>
        <option value='XMR'>XMR</option>
        <option value='EOS'>EOS</option>
        <option value='BNB'>BNB</option>
      </select>
      <select onChange={(e) => {
        setTimeScale(e.target.value);
        fetchAllData(symbol, e.target.value);
      }}>
        <option value='day'>DAY</option>
        <option value='hour'>HOUR</option>
        <option value='minute'>MINUTE</option>
      </select>
    </div>
  );
}