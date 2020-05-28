// https://stackoverflow.com/questions/24815106/can-i-separate-socket-io-event-listeners-into-different-modules
module.exports = function (socket) {
	console.log('a user connected' + socket.id);
	socket.on('disconnect', function () {
		console.log('User Disconnected');
	});

	socket.on('create_room', function (room_id) {
		socket.join(room_id);
	});

	socket.on('join_room', function (room_id) {
		socket.join(room_id);
	});
};
