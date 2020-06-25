import React from 'react';
import ChartView from './components/ChartView.jsx';
import QuerySelector from './components/QuerySelector.jsx';
import StatsView from './components/StatsView.jsx';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      historicData: [],
      currentData: {},
      currentSymbol: 'BTC',
      currentTimeScale: 'day',
      liveIntervalID: ''
    }
    this.fetchCurrentData = this.fetchCurrentData.bind(this);
    this.fetchHistoricData = this.fetchHistoricData.bind(this);
    this.fetchAllData = this.fetchAllData.bind(this);
    this.controlLiveDataStream = this.controlLiveDataStream.bind(this);
  }

  fetchCurrentData(symbol = 'BTC', toCurrency = 'USD') {
    axios.get(`/currentData/${symbol}`)
    .then(({data}) => {
      this.setState({ currentData: { DISPLAY: data.DISPLAY[symbol][toCurrency], RAW: data.RAW[symbol][toCurrency] } });
    })
    .catch((err) => {
      console.log('FETCH DATA ERROR');
    })
  }

  fetchHistoricData(symbol = 'BTC', timeScale = 'day') {
    axios.get(`/historicData/${symbol}/${timeScale}`)
    .then(({data}) => {
      data = data.Data.Data;
      return data.map((row) => {
        row.date = new Date(row.time * 1000);
        return row;
      })
    })
    .then((historicData) => {
      this.setState({ historicData });
    })
    .catch((err) => {
      console.log('FETCH DATA ERROR');
    })
  }

  fetchAllData(symbol, timeScale, toCurrency) {
    this.setState({ currentSymbol: symbol, currentTimeScale: timeScale });
    this.fetchHistoricData(symbol, timeScale);
    this.fetchCurrentData(symbol, toCurrency);
  }

  controlLiveDataStream(switchOn) {
    if (switchOn) {
      let liveIntervalID = setInterval( () => {
        this.fetchAllData(this.state.currentSymbol, this.state.currentTimeScale)
       } , 5000);
      this.setState({ liveIntervalID });
    } else {
      clearInterval(this.state.liveIntervalID);
      this.setState({ liveIntervalID: '' });
    }
  }

  componentDidMount() {
    this.fetchAllData();
  }

  render() {
    return (
      <>
        {!this.state.historicData.length || !Object.keys(this.state.currentData).length ?
          <div>Loading...</div> :
          <>
            <StatsView data={ this.state.currentData} controlLiveDataStream={ this.controlLiveDataStream } />
            <ChartView data={ this.state.historicData } />
          </>}
          <QuerySelector fetchAllData = { this.fetchAllData } />
      </>
    );
  }
}

export default App;