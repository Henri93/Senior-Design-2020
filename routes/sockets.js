var Pump = require('../models/pump.js')

/*
 * Route for hub connecting
 */
var onHubConnect = function(io, data) {
	console.log("Hub connected");
	//add pumps to db
	var pumps = data["pumps"]
	for(var i = 0; i < pumps.length; i++){
	  	console.log("connecting pump " + pumps[i])
	  	var p = new Pump({
	    	port: pumps[i],
	    	isRunning: false
	  	})
	  	p.save(function(err) {
	    	if (err) {
		      	console.log(err)
	    	} 
	  	})
	}

	io.emit('hub_connect', data);
};

/*
 * Route for hub disconnecting
 */
var onHubDisconnect = function(io, data) {
	console.log("Hub disconnected");
	//remove pumps from db
	var pumps = data["pumps"]
	for(var i = 0; i < pumps.length; i++){
		console.log("disconnecting pump " + pumps[i])
		Pump.deleteOne({'port': pumps[i]}, function(err, result) {
	    if (err) {
	      console.log(err)
	    }
	  })
	}
	
	io.emit('hub_disconnect', data);
};

var sockets = { 
  hub_connect: onHubConnect,
  hub_disconnect: onHubDisconnect
};

module.exports = sockets;