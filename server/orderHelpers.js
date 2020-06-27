const queries = require('../db/queries');
const apiHelpers = require('./apiHelpers');

module.exports = {
  processOrders: () => {
    queries.getOrders()
    .then((data) => {
      let unfilledOrders = data.filter((row) => !row.filled);
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
      console.log(ordersBySymbol); //! ALL NEW FILLED POSITIONS!!!
    })

    return Promise.resolve(1); // for tests only - delete later
  }
}


// On componentDidMount
  // for each symbols unfilled orders
  // look at earliest createdAt order
  // call hourly historic data for that time and after
  // iterate through data, starting at the earliest time
    // for each order price,
      // check if historic price is less than order price
      // if so, store the time filled, and change filled status to true