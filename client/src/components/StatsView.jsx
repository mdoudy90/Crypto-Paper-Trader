import React, { useState } from 'react';
import moment from 'moment';

const StatsView = ({ data, controlLiveDataStream }) => {
  const [isLive, toggleIsLive] = useState(false);
  return (
    <div>

      <label>
        LIVE <input checked = {isLive ? true : false} type="checkbox" onChange = { () => {
            toggleIsLive(!isLive);
            controlLiveDataStream(!isLive);
          } } />
      </label>

      <h3>{ data.RAW.FROMSYMBOL } { data.DISPLAY.FROMSYMBOL }</h3>
      <img src={`https://www.cryptocompare.com${data.DISPLAY.IMAGEURL}`}></img>
      <p>LAST UPDATE: { moment().calendar(new Date(data.RAW.LASTUPDATE * 1000)) }</p>
      <div>
        <div>PRICE</div>
        <div>{ data.DISPLAY.PRICE }</div>
      </div>
      <div>
        <div>MARKET CAP</div>
        <div>{ data.DISPLAY.MKTCAP }</div>
      </div>
      <div>
        <div>SUPPLY</div>
        <div>{ data.DISPLAY.SUPPLY }</div>
      </div>
      <div>
        <div>24 HOUR CHANGE</div>
        <div>{ data.DISPLAY.CHANGE24HOUR }</div>
      </div>
      <div>
        <div>24 HOUR LOW</div>
        <div>{ data.DISPLAY.LOW24HOUR }</div>
      </div>
      <div>
        <div>24 HOUR HIGH</div>
        <div>{ data.DISPLAY.HIGH24HOUR }</div>
      </div>
      <div>
        <div>24 HOUR OPEN</div>
        <div>{ data.DISPLAY.OPEN24HOUR }</div>
      </div>
      <div>
        <div>24 HOUR TOTAL VOLUME</div>
        <div>{ data.DISPLAY.TOTALVOLUME24HTO }</div>
      </div>

    </div>
  );
}

export default StatsView;