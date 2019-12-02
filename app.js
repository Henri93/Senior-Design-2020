/* Some initialization boilerplate. Also, we include the code from
   routes/routes.js, so we can have access to the routes. Note that
   we get back the object that is defined at the end of routes.js,
   and that we use the fields of that object (e.g., routes.get_main)
   to access the routes. */
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var routes = require('./routes/routes.js');
var session = require('express-session');
var app = express();

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

/* ---END ROUTES--- */


/* Run the server */
var server = app.listen(8080);
const io = require('socket.io')(server);

//Handle chat socket.io on chat namespace
const chat = io.of('/order');
chat.on('connection', (socket) => {
	console.log("New user connected to /order namespace!\n\n");
	
	socket.on('order_data', (data) => {
		console.log("got order data: "+ JSON.stringify(data));
	});
});

console.log('Server running on port 8080. Now open http://localhost:8080/ in your browser!');
