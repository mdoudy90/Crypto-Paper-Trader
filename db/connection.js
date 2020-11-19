const mongoose = require('mongoose');
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://admin:qIVo3GyPudSuIiR6@cluster0.hnqyi.mongodb.net/<dbname>?retryWrites=true&w=majority';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to mongo instance');
});
mongoose.connection.on('error', (err) => {
  console.error('Error connectiong to mongo', err);
});

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
  cash: Number,
  buyingPower: Number,
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