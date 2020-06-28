const apiHelpers = require('./apiHelpers');
const orderHelpers = require('./orderHelpers');
const queries = require('../db/queries');

module.exports = {
  apiGetHistoricData: (symbol, timeScale) => apiHelpers.getHistoricData(symbol, timeScale),
  apiGetCurrentData: (symbol) => apiHelpers.getCurrentData(symbol),

  dbAddUser: (userData) => queries.addUser(userData),
  dbLoginUser: (loginData) => queries.loginUser(loginData),
  dbLogoutUser: (token) => queries.logoutUser(token),
  dbGetUserData: (token) => queries.getUserData(token),
  dbUpdateUserData: (token, data) => queries.updateUserData(token, data),
  updateUserOrders: (token) => orderHelpers.updateUserOrders(token),
  dbGetAllUsers: () => queries.getAllUsers(),

  dbAddOrder: (orderData) => queries.addOrder(orderData),
  dbGetOrders: () => queries.getOrders(),
  processOrders: () => orderHelpers.processOrders(),
}