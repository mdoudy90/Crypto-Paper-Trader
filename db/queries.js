const UIDGenerator = require('uid-generator');
const { User, Order } = require('./connection');

module.exports = {
  addUser: (userData) => {
    return new User({ ...userData, cashAvailable: 1000000 }).save();
  },
  loginUser: (loginData) => {
    const uidgen = new UIDGenerator(256);
    return uidgen.generate()
      .then((uid) => {
        return User.findOneAndUpdate(loginData, { token: uid }).exec()
        .then((data) => {
          if (!data) {
            throw 'NO MATCH FOUND';
          } else {
            return uid;
          }
        })
      });
  },
  logoutUser: (token) => {
    return User.findOneAndUpdate({ token }, { token: '' });
  },
  getUserData: (token) => {
    return User.find({ token }).exec();
  },
  updateUserData: (token, data) => {
    return User.findOneAndUpdate({ token }, data);
  },
  getAllUsers: () => {
    return User.find().exec();
  },
  addOrder: (orderData) => {
    return new Order(orderData).save();
  },
  getOrders: () => {
    return Order.find().exec();
  },
  updateOrder: (data) => {
    return Order.findOneAndUpdate({ _id: data._id }, data);
  },
}