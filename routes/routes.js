/*
 * Route for main dashboard
 */
var getMain = function(req, res) {
  res.render('index.ejs', {});
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
