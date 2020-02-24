/* global $ */
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';
var firstTime;
var ctx;
var myPieChart;
var interval;
var socket;

$(document).ready(function() {
	//var socket = io.connect('http://10.103.126.250:3000/order');
	socket = io.connect('http://localhost:3000');

	// socket.emit('hub_connect', {timestamp: Date.now(), pumps: [8]});
	// socket.emit('hub_disconnect', {timestamp: Date.now(), pumps: [8]});

	/*------SOCKET EVENTS*------*/
	socket.on('order_data', (data) =>{
		
	});
});