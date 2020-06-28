import React from 'react';
import UIDGenerator from 'uid-generator';
import Header from './components/Header.jsx';
import ChartView from './components/ChartView.jsx';
import QuerySelector from './components/QuerySelector.jsx';
import StatsView from './components/StatsView.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Portfolio from './components/Portfolio.jsx';
import Quotes from './components/Quotes.jsx';
import SignUp from './components/SignUp.jsx';
import Login from './components/Login.jsx';
import OrderForm from './components/OrderForm.jsx';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      historicData: [],
      currentData: {},
      currentSymbol: 'BTC',
      currentTimeScale: 'day',
      liveIntervalID: '',
      currentView: 'charts',
      buyingPower: 0.00,
      cash: 0.00,
      positions: {},
      orders: [],
    }
    this.fetchCurrentData = this.fetchCurrentData.bind(this);
    this.fetchHistoricData = this.fetchHistoricData.bind(this);
    this.fetchAllData = this.fetchAllData.bind(this);
    this.processOrders = this.processOrders.bind(this);
    this.controlLiveDataStream = this.controlLiveDataStream.bind(this);
    this.addNewUser = this.addNewUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.getUserData = this.getUserData.bind(this);
    this.updateUserData = this.updateUserData.bind(this);
    this.switchView = this.switchView.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
    this.updateUserOrders = this.updateUserOrders.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
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
        row.volume = row.volumeto;
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

  addNewUser(newUserData) {
    axios.post('/users', newUserData)
      .then(() => {
        this.loginUser({ username: newUserData.username, password: newUserData.password });
      }).catch((err) => {
        alert('Username already taken');
      });
  }

  loginUser(userData) {
    axios.post('/users/login', userData)
      .then(({data}) => {
        this.setState({ token: data, currentView: 'portfolio' });
        this.getUserData();
        this.updateUserOrders();
      }).catch((err) => {
        alert('Username and/or password does not match');
      });
  }

  logoutUser() {
    axios.post(`/users/logout/${this.state.token}`)
      .then(() => {
        this.setState({ token: '', username: null, positions: {}, orders: [], cash: null, buyingPower: null, portfolioValue: null, currentView: 'charts' });
      }).catch((err) => {
        console.log('Logout unsuccessful');
      });
  }

  getUserData() {
    axios.get(`/users/data/${this.state.token}`)
      .then(({data}) => {
        this.setState(data);
      }).catch((err) => {
        console.log('User data fetch unsuccessful');
      });
  }

  updateUserData(newData) {
    axios.post(`/users/data/${this.state.token}`, newData)
      .then(() => {
        this.getUserData();
      }).catch((err) => {
        console.log('User data update failed');
      });
  }

  placeOrder(order, total) {
    const uidgen = new UIDGenerator(256);
    uidgen.generate()
      .then((orderID) => {
        order = { ...order, orderID, filled: false }
        this.updateUserData({buyingPower: this.state.buyingPower - total, orders: [ ...this.state.orders, order ]});
      })
      .then(() => {
        axios.post('/orders', { ...order, username: this.state.username })
          .then(() => {
            console.log('Order placed');
          }).catch((err) => {
            console.log('Order placement failed');
          });
      })
  }

  processOrders() {
    axios.post('/orders/process')
      .then(() => {
        console.log('Orders processed');
      }).catch((err) => {
        console.log('Orders processing failed');
      });
  }

  updateUserOrders() {
    axios.post(`/users/orders/${this.state.token}`)
    .then(({data}) => {
      this.setState(data);
    }).catch((err) => {
      console.log('NO UNFILLED USER ORDERS');
    });
  }

  //! Need to refactor to backend logic, all users should not be present in state
  getAllUsers() {
    axios.get('/users')
    .then(({data}) => {
      this.setState({ users: data });
    }).catch((err) => {
      console.log('USERS FETCH UNSUCCESSFUL');
    });
  }

  switchView(view) {
    this.setState({ currentView: view });
  }

  componentDidMount() {
    this.fetchAllData();
    this.processOrders();
    this.getAllUsers();
  }

  render() {
    return (
      <>
      <Header switchView = { this.switchView } isLoggedIn = { !!this.state.token } logoutUser = { this.logoutUser } />
      { this.state.currentView === 'charts' &&
        <>
        {!this.state.historicData.length || !Object.keys(this.state.currentData).length ?
          <div>Loading...</div> :
          <>
            <StatsView data={ this.state.currentData} controlLiveDataStream={ this.controlLiveDataStream } />
            <ChartView data={ this.state.historicData } currentTimeScale={ this.state.currentTimeScale } />
            <QuerySelector fetchAllData = { this.fetchAllData } />
            { this.state.token &&
              <OrderForm
                symbol = { this.state.currentSymbol }
                currentPrice = { this.state.currentData.RAW.PRICE }
                buyingPower = { this.state.buyingPower }
                placeOrder = { this.placeOrder }
                positions = { this.state.positions }/>
              }
          </>}
        </> }

      { this.state.currentView === 'quotes' && <Quotes lastDataCallReference = { this.state.historicData[0].time } /> }
      { this.state.currentView === 'leaderboard' && this.state.users && <Leaderboard
          users = { this.state.users }  /> }
      { this.state.currentView === 'portfolio' && this.state.username && <Portfolio
          cash = { this.state.cash }
          buyingPower = { this.state.buyingPower }
          positions = { this.state.positions }
          orders = { this.state.orders } /> }
      { this.state.currentView === 'signup' && <SignUp addNewUser = { this.addNewUser }/> }
      { this.state.currentView === 'login' && <Login loginUser = { this.loginUser } switchView = { this.switchView }/> }
      </>
    );
  }
}

export default App;