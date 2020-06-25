const apiHelpers = require('./apiHelpers');
const queries = require('../db/queries');

module.exports = {
  apiGetHistoricData: (symbol, timeScale) => apiHelpers.getHistoricData(symbol, timeScale),
  apiGetCurrentData: (symbol) => apiHelpers.getCurrentData(symbol),
  dbAddUser: (userData) => queries.addUser(userData),
  dbLoginUser: (loginData) => queries.loginUser(loginData),
  dbLogoutUser: (token) => queries.logoutUser(token),
  dbGetUserData: (token) => queries.getUserData(token),
  dbUpdateUserData: (token, data) => queries.updateUserData(token, data),
}