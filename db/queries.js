const UIDGenerator = require('uid-generator');
const { User } = require('./connection');

module.exports = {
  addUser: (userData) => {
    return new User({ ...userData, cash: 1000000 }).save();
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
}