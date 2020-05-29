const shortid = require('shortid');

// https://stackoverflow.com/questions/24815106/can-i-separate-socket-io-event-listeners-into-different-modules
module.exports = function (socket) {
	console.log('a user connected' + socket.id);
	socket.on('disconnect', function () {
		console.log('User Disconnected');
	});

	socket.on('create_room', function (callback) {
		let room_id = shortid.generate().slice(0, 5);
		let exist = socket.adapter.rooms[room_id];
		while (exist) {
			room_id = shortid.generate().slice(0, 5);
			exist = socket.adapter.rooms[room_id];
		}
		socket.join(room_id);
		console.log('created room: ', room_id);
		callback(room_id);
	});

	socket.on('join_room', function (room_id, callback) {
		// https://github.com/rase-/socket.io-php-emitter/issues/18
		let exist = socket.adapter.rooms[room_id];
		if (exist) {
			socket.join(room_id);
			console.log('joined room: ', room_id);
			callback('room exists');
		} else {
			callback("room doesn't exist", room_id);
		}
	});
};
