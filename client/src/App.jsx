import React from 'react';
import ChartView from './components/ChartView.jsx';
import QuerySelector from './components/QuerySelector.jsx';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
    this.fetchHistoricData = this.fetchHistoricData.bind(this);
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
    .then((data) => {
      this.setState({ data });
    })
    .catch((err) => {
      console.log('FETCH DATA ERROR');
    })
  }

  componentDidMount() {
    this.fetchHistoricData();
  }

  render() {
    return (
      <>
        <QuerySelector fetchHistoricData = { this.fetchHistoricData } />
        {!this.state.data.length ? <div>Loading...</div> : <ChartView data={ this.state.data } />}
      </>
    );
  }
}

export default App;