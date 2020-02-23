var Pumps = require('../models/pump.js')

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
