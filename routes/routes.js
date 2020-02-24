var Pumps = require('../models/pump.js')
var Order = require('../models/order.js')

/*
 * Route for main dashboard
 */
var getMain = function(req, res, next) {
  Pumps.find({}, function(err, result) {
    if (err) {
      return next(err)
    }
    res.render('index.ejs', {
      pumps: result
    })
  });
  // var ingredientsMap = {};
  // ingredientsMap["Citric Acid"] = "{\"dispensed\": 1, \"total\": 2}"
  // ingredientsMap["Ivy Extract"] = "{\"dispensed\": 1, \"total\": 1}"
  // ingredientsMap["Acai Oil"] = "{\"dispensed\": 2, \"total\": 4}"

  // var o = new Order({
  //   uuid: "0ffff",
  //   ingredients: ingredientsMap,
  //   completed: false,
  //   receivedTime: new Date,
  //   completedTime: new Date
  // })
  // o.save(function(err) {
  //   if (!err) {
  //     res.json({
  //       success: 'OK'
  //     })
  //   } else {
  //     next(err)
  //   }
  // })
  // Order.remove({'uuid': 'e4ab7'}, function(err, result) {
  //   if (err) {
  //     return next(err)
  //   }
  //   res.json(result)
  // })
};

/*
 * Route for table of orders
 */
var getOrders = function(req, res) {
	let order = req.query.orderId;
	if(order != null){
		console.log("Got order id="+order);
		res.render('order.ejs', {orderId: order});
	}else{
		res.render('orders.ejs', {orderErr: "Invalid order id!"});
	}
};


var routes = { 
  get_main: getMain,
  get_orders: getOrders
};

module.exports = routes;
