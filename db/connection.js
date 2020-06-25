const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/cryptoTrader', {useNewUrlParser: true});

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
  email: String,
  positions: {},
  cash: Number
}, { timestamps: true });

module.exports = {
  User: mongoose.model('User', userSchema),
}