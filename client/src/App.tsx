import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UIDGenerator from 'uid-generator';
import ChartView from './components/ChartView';
import { Header } from './components/Header';
import { StatsView } from './components/StatsView';
import { Leaderboard } from './components/Leaderboard';
import { Portfolio } from './components/Portfolio';
import { Quotes } from './components/Quotes';
import { SignUp } from './components/SignUp';
import { Login } from './components/Login';
import { OrderForm } from './components/OrderForm';

export const App: React.FC = () => {
  const [historicData, setHistoricData] = useState<{ [key: string]: any }[]>([]);
  const [currentData, setCurrentData] = useState<{ [key: string]: any }>({});
  const [currentSymbol, setCurrentSymbol] = useState<string>('BTC');
  const [currentTimeScale, setCurrentTimeScale] = useState<string>('day');
  const [liveIntervalID, setLiveIntervalID] = useState<NodeJS.Timeout | null>(null);
  const [currentView, setCurrentView] = useState<string>('charts');
  const [users, setUsers] = useState<any>([]);
  const [token, setToken] = useState<string>('');
  const [username, setUsername] = useState<string | null | undefined>(null);
  const [positions, setPositions] = useState<{ [key: string]: number }>({});
  const [orders, setOrders] = useState<{ [key: string]: any }[]>([]);
  const [cash, setCash] = useState<number>(0);
  const [buyingPower, setBuyingPower] = useState<number>(0);

  const fetchCurrentData = (symbol, toCurrency) => {
    symbol = symbol || 'BTC';
    toCurrency = toCurrency || 'USD';
    axios
      .get(`/currentData/${symbol}`)
      .then(({ data }) =>
        setCurrentData({ DISPLAY: data.DISPLAY[symbol][toCurrency], RAW: data.RAW[symbol][toCurrency] }),
      )
      .catch((err) => {
        console.log('FETCH DATA ERROR');
      });
  };

  const fetchHistoricData = (symbol, timeScale) => {
    symbol = symbol || 'BTC';
    timeScale = timeScale || 'day';
    axios
      .get(`/historicData/${symbol}/${timeScale}`)
      .then(({ data }) => {
        data = data.Data.Data;
        return data.map((row) => {
          row.date = new Date(row.time * 1000);
          row.volume = row.volumeto;
          return row;
        });
      })
      .then((historicData) => setHistoricData(historicData))
      .catch((err) => {
        console.log('FETCH DATA ERROR');
      });
  };

  const fetchAllData = (symbol, timeScale, toCurrency) => {
    symbol = symbol || 'BTC';
    timeScale = timeScale || 'day';
    toCurrency = toCurrency || 'USD';
    setCurrentSymbol(symbol);
    setCurrentTimeScale(timeScale);
    fetchHistoricData(symbol, timeScale);
    fetchCurrentData(symbol, toCurrency);
  };

  const controlLiveDataStream = (switchOn) => {
    if (switchOn) {
      let liveIntervalID = setInterval(() => {
        fetchAllData(currentSymbol, currentTimeScale, null);
      }, 5000);
      setLiveIntervalID(liveIntervalID);
    } else {
      clearInterval(liveIntervalID);
      setLiveIntervalID(null);
    }
  };

  const addNewUser = (newUserData) => {
    axios
      .post('/users', newUserData)
      .then(() => {
        loginUser({ username: newUserData.username, password: newUserData.password });
      })
      .catch((err) => {
        alert('Username already taken');
      });
  };

  const loginUser = (userData) => {
    axios
      .post('/users/login', userData)
      .then(({ data }) => {
        setToken(data);
        setCurrentView('portfolio');
        return data;
      })
      .then((data) => {
        getUserData(data);
        updateUserOrders(data);
        getAllUsers();
      })
      .catch((err) => {
        alert('Username and/or password does not match');
      });
  };

  const logoutUser = () => {
    axios
      .post(`/users/logout/${token}`)
      .then(() => {
        setToken('');
        setUsername(null);
        setPositions({});
        setOrders([]);
        setCash(0);
        setBuyingPower(0);
        setCurrentView('charts');
      })
      .catch((err) => {
        console.log('Logout unsuccessful');
      });
  };

  const getUserData = (token) => {
    axios
      .get(`/users/data/${token}`)
      .then(({ data }) => {
        setBuyingPower(data.buyingPower);
        setCash(data.cash);
        setOrders(data.orders);
        !!data.positions && setPositions(data.positions);
        setUsername(data.username);
      })
      .catch((err) => {
        console.log('User data fetch unsuccessful');
      });
  };

  const updateUserData = (newData) => {
    axios
      .post(`/users/data/${token}`, newData)
      .then(() => {
        getUserData(token);
      })
      .catch((err) => {
        console.log('User data update failed');
      });
  };

  const placeOrder = (order, total) => {
    const uidgen = new UIDGenerator(256);
    uidgen
      .generate()
      .then((orderID) => {
        let newBuyingPower = buyingPower;
        if (order.action === 'buy') {
          newBuyingPower = buyingPower - total;
        }
        order = { ...order, orderID, filled: false };
        updateUserData({ newBuyingPower, orders: [...orders, order] });
      })
      .then(() => {
        axios
          .post('/orders', { ...order, username })
          .then(() => {
            console.log('Order placed');
          })
          .catch((err) => {
            console.log('Order placement failed');
          });
      })
      .then(processOrders)
      .then(() => {
        updateUserOrders(token);
      })
      .catch((err) => {
        console.log('Order placement unsuccessful');
      });
  };

  const processOrders = () => {
    axios
      .post('/orders/process')
      .then(() => {
        console.log('Orders processed');
      })
      .catch((err) => {
        console.log('Orders processing failed');
      });
  };

  const updateUserOrders = (token) => {
    axios
      .post(`/users/orders/${token}`)
      .then(({ data }) => {
        if (!!data) {
          setBuyingPower(data.buyingPower);
          setCash(data.cash);
          setOrders(data.orders);
          setPositions(data.positions);
        }
      })
      .catch((err) => {
        console.log('NO UNFILLED USER ORDERS');
      });
  };

  const getAllUsers = () => {
    axios
      .get('/users')
      .then(({ data }) => setUsers(data))
      .catch((err) => {
        console.log('USERS FETCH UNSUCCESSFUL');
      });
  };

  useEffect(() => {
    fetchAllData(null, null, null);
    processOrders();
    getAllUsers();
  }, []);

  return (
    <>
      <Header switchView={setCurrentView} isLoggedIn={!!token} logoutUser={logoutUser} />
      {currentView === 'charts' && (
        <>
          {!historicData.length || !Object.keys(currentData).length ? (
            <div>Loading...</div>
          ) : (
              <>
                <StatsView data={currentData} controlLiveDataStream={controlLiveDataStream} />
                {/* @ts-ignore  */}
                <ChartView data={historicData} currentTimeScale={currentTimeScale} fetchAllData={fetchAllData} />
                {token && (
                  <div className='order-portfolio-container'>
                    <OrderForm
                      symbol={currentSymbol}
                      currentPrice={currentData.RAW.PRICE}
                      buyingPower={buyingPower}
                      placeOrder={placeOrder}
                      positions={positions}
                    />
                    <Portfolio cash={cash} buyingPower={buyingPower} positions={positions} orders={orders} />
                  </div>
                )}
              </>
            )}
        </>
      )}

      {currentView === 'quotes' && <Quotes lastDataCallReference={historicData[0].time} />}
      {currentView === 'leaderboard' && users && <Leaderboard users={users} />}
      {currentView === 'portfolio' && username && (
        <Portfolio cash={cash} buyingPower={buyingPower} positions={positions} orders={orders} />
      )}
      {currentView === 'signup' && <SignUp addNewUser={addNewUser} />}
      {currentView === 'login' && <Login loginUser={loginUser} switchView={setCurrentView} />}
    </>
  );
};