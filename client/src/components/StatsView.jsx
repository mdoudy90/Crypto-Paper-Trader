import React, { useState } from 'react';
import moment from 'moment';

const StatsView = ({ data, controlLiveDataStream }) => {
  const [isLive, toggleIsLive] = useState(false);
  return (
    <div className = 'stats-view-container'>
      <div className = 'stats-header'>
        <h3>{ data.RAW.FROMSYMBOL }</h3>
        <img src={`https://www.cryptocompare.com${data.DISPLAY.IMAGEURL}`}></img>
        <div className='live-toggle-container'>
          <p>LAST UPDATE: { moment().calendar(new Date(data.RAW.LASTUPDATE * 1000)).toUpperCase() }</p>

          <div className = 'live-toggle'>
						<p>LIVE</p>
						<div className = { isLive ? 'toggle-switch-active' : 'toggle-switch' } >
							<div
								className = { isLive ? 'slider-active' : 'slider' }
								onClick = { () => {
                  toggleIsLive(!isLive);
                  controlLiveDataStream(!isLive);
                } } ></div>
						</div>
					</div>

        </div>
      </div>
      <div className = 'stats-container'>
        <div>
          <h4>PRICE</h4>
          <div>{ data.DISPLAY.PRICE }</div>
        </div>
        <div>
          <h4>MARKET CAP</h4>
          <div>{ data.DISPLAY.MKTCAP }</div>
        </div>
        <div>
          <h4>SUPPLY</h4>
          <div>{ data.DISPLAY.SUPPLY }</div>
        </div>
        <div>
          <h4>24 HOUR % CHANGE</h4>
          <div className={ data.RAW.CHANGEPCT24HOUR < 0 ? 'negative' : 'positive' }>{ data.DISPLAY.CHANGEPCT24HOUR }</div>
        </div>
        <div>
          <h4>24 HOUR LOW</h4>
          <div>{ data.DISPLAY.LOW24HOUR }</div>
        </div>
        <div>
          <h4>24 HOUR HIGH</h4>
          <div>{ data.DISPLAY.HIGH24HOUR }</div>
        </div>
        <div>
          <h4>24 HOUR CHANGE</h4>
          <div className={ data.RAW.CHANGE24HOUR < 0 ? 'negative' : 'positive' }>{ data.DISPLAY.CHANGE24HOUR }</div>
        </div>
        <div>
          <h4>24 HOUR OPEN</h4>
          <div>{ data.DISPLAY.OPEN24HOUR }</div>
        </div>

      </div>
    </div>
  );
}

export default StatsView;