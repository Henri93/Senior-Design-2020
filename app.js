/* Some initialization boilerplate. Also, we include the code from
   routes/routes.js, so we can have access to the routes. Note that
   we get back the object that is defined at the end of routes.js,
   and that we use the fields of that object (e.g., routes.get_main)
   to access the routes. */
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var routes = require('./routes/routes.js');
var sockets = require('./routes/sockets.js');
var session = require('express-session');
var mongoose = require('mongoose');

var apiRoutes = require('./routes/api.js')

var app = express();

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/cosmetric', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('combined'));
app.use(express.static(__dirname + '/public'));
app.use(session({secret: 'com.henrygar.sd'}));

/* ---ROUTES--- */

//Dashboard
app.get('/', routes.get_main);

//Orders
app.get('/orders', routes.get_orders);

app.use('/api', apiRoutes);

/* ---END ROUTES--- */

/**
 * Some browsers request the favicon (the little icon that shows up in the tab)
 * with every request, we just want to throw a 404 instead of any generic error
 */
app.get('/favicon.ico', function(_, res) {
  return res.status(404).send()
})

// Catch all for all other get requests
app.get('*', function(_, res) {
  return res.status(404).send()
})

// Middleware for catching any errors
app.use(function(err, _, res) {
  if (err) {
    return res.send('ERROR :  ' + err.message)
  }
})

/* Run the server */
var server = app.listen(process.env.PORT || 3000, function() {
  console.log('App listening on port ' + (process.env.PORT || 3000))
});

const io = require('socket.io')(server);
io.on('connection', (socket) => {
	console.log("New device connected!\n");

	socket.on('hub_connect', (data) => {
		sockets.hub_connect(io, data);
	});

	socket.on('hub_disconnect', (data) => {
		sockets.hub_disconnect(io, data);
	});
	
	socket.on('order_data', (data) => {
		console.log("got order data: " + JSON.stringify(data));
		io.emit('order_data', data);
	});

	socket.on('run_order', (data) => {
		// console.log("run order data: " + JSON.stringify(data));
		io.emit('run_order', data);
	});

	socket.on('finish_order', (data) => {
		io.emit('finish_order', data);	
	});

	socket.on('send_command_finite_accel', (data) => {
		console.log("got command: " + JSON.stringify(data));
		io.emit('send_command_finite_accel', data);
	});
});
