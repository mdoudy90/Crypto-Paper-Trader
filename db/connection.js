const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/cryptoTrader', {useNewUrlParser: true});

const Schema = mongoose.Schema;

const userSchema = new Schema({
  token: String,
  username: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
  email: String,
  positions: {},
  orders: [],
  cashAvailable: Number,
  portfolioValue: Number
}, { timestamps: true });

const orderSchema = new Schema({
  orderID: String,
  action: String,
  price: Number,
  quantity: Number,
  symbol: String,
  timePlaced: String,
  timeFilled: String,
  username: String,
  filled: Boolean,
}, { timestamps: true });

module.exports = {
  User: mongoose.model('User', userSchema),
  Order: mongoose.model('Order', orderSchema),
}