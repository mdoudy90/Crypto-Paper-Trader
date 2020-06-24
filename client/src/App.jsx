import React from 'react';
import ChartView from './components/ChartView.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }
  componentDidMount() {

    let data = [{
      absoluteChange: "",
      close: 25.710416,
      date: new Date(1592956800000),
      dividend: "",
      high: 25.835021381744056,
      low: 25.411360259406774,
      open: 25.436282332605284,
      percentChange: "",
      split: "",
      volume: 38409100,
      },
      {
      absoluteChange: "",
      close: 25.718722,
      date: new Date(1592956700000),
      dividend: "",
      high: 25.83502196495549,
      low: 25.452895407434543,
      open: 25.627344939513726,
      percentChange: "",
      split: "",
      volume: 49749600,
      }];

    this.setState({ data });

  }
  render() {
    return (
      <>
        <div>Hello World!</div>
        <ChartView data={ this.state.data } />
      </>
    );
  }
}

export default App;