var currently_online = 0;

var app = module.parent.exports;

// Setup Socket.IO
var io = require('socket.io').listen(app);
io.sockets.on('connection', function(client) {

	console.log('Client Connected');
	
	currently_online++;

	var connect_message = {
		online: currently_online
	}
	
	client.broadcast.emit('online', connect_message);
	client.emit('online', connect_message);
	
	client.on('c', function(message) {
		var coord_message = {
			c: message,
			session_id: client.sessionId
		}
		
		client.broadcast.emit('c', coord_message);
	});
	
	client.on('disconnect', function() {
		var disconnect_message = {
			online: --currently_online
		}
		client.broadcast.emit('online', disconnect_message);
		client.json.emit('online', disconnect_message);

		console.log('Client Disconnected.');
	});
});