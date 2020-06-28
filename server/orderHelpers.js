const queries = require('../db/queries');
const apiHelpers = require('./apiHelpers');

module.exports = {
  processOrders: () => {
    return queries.getOrders()
    .then((data) => {
      let unfilledOrders = data.filter((row) => !row.filled);
      if (!unfilledOrders.length) {
        throw 'NO UNFILLED ORDERS';
      }
      let earliestOrderDate = unfilledOrders[0].timePlaced;

      // unixTime plus 1000 hours
      let unixTime1000 = (Date.parse(earliestOrderDate) + (1000*60*60*1000)) / 1000;

      let ordersBySymbol = {};
      return Promise.resolve(
        unfilledOrders.forEach((row) => {
          if (ordersBySymbol[row.symbol]) {
            ordersBySymbol[row.symbol].push(row);
          } else {
            ordersBySymbol[row.symbol] = [ row ];
          }
        }))
        .then(() => {
          return { ordersBySymbol, unixTime1000 };
        })
    })
    .then(({ ordersBySymbol, unixTime1000 }) => {

      let promiseArray = [];

      for (let key in ordersBySymbol) {
        promiseArray.push(Promise.resolve(
          apiHelpers.getHistoricData(key, 'hour', unixTime1000)
          .then(({data}) => {
            let dataArray = data.Data.Data;
            let ordersArray = ordersBySymbol[key].slice();
            let filledArray = [];
            let ordersIndex = 0;

            dataArray.forEach(({ low, high, time }, index) => {
              while (ordersIndex < ordersArray.length) {
                let orderPrice = ordersArray[ordersIndex].price;
                let orderUnixTime = Date.parse(ordersArray[ordersIndex].timePlaced) / 1000;
                let orderType = ordersArray[ordersIndex].action;

                if (orderType === 'buy' && orderPrice >= low && orderUnixTime <= time) {
                  ordersArray[ordersIndex].filled = true;
                  ordersArray[ordersIndex].timeFilled = new Date(time * 1000);
                  filledArray.push(...ordersArray.splice(ordersIndex, 1));
                } else
                if (orderType === 'sell' && orderPrice <= high && orderUnixTime <= time) {
                  ordersArray[ordersIndex].filled = true;
                  ordersArray[ordersIndex].timeFilled = new Date(time * 1000);
                  filledArray.push(...ordersArray.splice(ordersIndex, 1));
                } else {
                  ordersIndex += 1;
                }
              }
              ordersIndex = 0;
            });
            ordersBySymbol[key] = filledArray;
          })
        ))
      }
      return Promise.all(promiseArray).then(() => ordersBySymbol );

    }).then((ordersBySymbol) => {
      let filledOrdersArray = Object.values(ordersBySymbol).flat();

      filledOrdersArray.forEach((order) => {
        queries.updateOrder(order).then(() => {
          console.log(`ORDER ${order._id} FILLED`);
        }).catch((err) => {
          console.log('ORDER UPDATE ERROR: ', err);
        });
      })
    }).catch((err) => {
      console.log(err);
    })
  },

  updateUserOrders: (token) => {
    return queries.getUserData(token).then(([data]) => {
      let userBuyingPower = data.buyingPower;
      let userCash = data.cash;
      let userPositions = data.positions || {};
      let unfilledUserOrders = data.orders.filter((order) => !order.filled);
      if (!unfilledUserOrders.length) {
        throw 'NO UNFILLED USER ORDERS';
      }
      return queries.getOrders().then((orders) => {
        let filledOrders = orders.filter((order) => order.filled).reduce((acc, cur) => {
          acc[cur.orderID] = cur;
          return acc;
        }, {});

        unfilledUserOrders.forEach((userOrder) => {
          let filledOrder = filledOrders[userOrder.orderID] ? filledOrders[userOrder.orderID] : null;
          if (filledOrder) {
            userOrder.filled = true;
            userOrder.timeFilled = filledOrder.timeFilled;

            if (filledOrder.action === 'buy') {
              userCash -= filledOrder.quantity * filledOrder.price;
              userPositions[filledOrder.symbol] !== undefined ?
                userPositions[filledOrder.symbol] += filledOrder.quantity :
                userPositions[filledOrder.symbol] = filledOrder.quantity;
            }
            if (filledOrder.action === 'sell') {
              userBuyingPower += filledOrder.quantity * filledOrder.price;
              userCash += filledOrder.quantity * filledOrder.price;
              userPositions[filledOrder.symbol] -= filledOrder.quantity;
              userPositions[filledOrder.symbol] === 0 ? delete userPositions[filledOrder.symbol] : null;
            }
          }
        })
        unfilledUserOrders.filter((order) => !order.filled);

        return { unfilledUserOrders, userCash, userBuyingPower, userPositions };
      }).then(({ unfilledUserOrders, userCash, userBuyingPower, userPositions }) => {
        let orders = unfilledUserOrders;
        let cash = userCash;
        let buyingPower = userBuyingPower;
        let positions = userPositions;

        queries.updateUserData(token, { orders, cash, buyingPower, positions })
        .then((data) => {
          console.log('USER DATA UPDATED');
        }).catch((err) => {
          console.log('USER UPDATE ERROR: ', err);
        });
        return { orders, cash, buyingPower, positions };
      });
    }).catch((err) => {
      console.log(err);
    });
  },
}