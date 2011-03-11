var currently_online = 0;

var app = module.parent.exports;

// Setup Socket.IO
var io = require('socket.io').listen(app);
io.on('connection', function(client) {

	console.log('Client Connected');
	
	currently_online++;

	var connect_message = {
		online: currently_online
	}
	client.broadcast(connect_message);
	client.send(connect_message);
	
	client.on('message', function(message) {
		var coord_message = {
			c: message.c,
			session_id: client.sessionId
		}
		
		client.broadcast(coord_message);
	});
	
	client.on('disconnect', function() {
		var disconnect_message = {
			online: --currently_online
		}
		client.broadcast(disconnect_message);
		client.send(disconnect_message);

		console.log('Client Disconnected.');
	});
});