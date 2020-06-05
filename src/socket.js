const shortid = require('shortid');

// https://stackoverflow.com/questions/24815106/can-i-separate-socket-io-event-listeners-into-different-modules
module.exports = function (socket, io, username_socket_pair) {
	console.log('a user connected ' + socket.id);
	socket.on('disconnecting', function () {
		let room_id = '';
		if (socket.rooms) {
			Object.keys(socket.rooms).forEach((room) => {
				if (room.length == 5) {
					room_id = room;
				}
			});
		}
		if (room_id) {
			console.log('user disconnecting from: ', room_id);
			io.to(room_id).emit('user_disconnect', room_id);
		}
	});

	socket.on('leave_room', function (room_id) {
		try {
			socket.leave(room_id);
			io.to(room_id).emit('user_disconnect', room_id);
		} catch (e) {
			console.log('Error - leave room: ', e);
		}
	});

	socket.on('disconnect', function () {
		console.log('User Disconnected');
	});

	socket.on('create_room', function (username, callback) {
		username_socket_pair[socket.id] = username;

		let room_id = shortid.generate().slice(0, 5);
		let exist = socket.adapter.rooms[room_id];
		while (exist) {
			room_id = shortid.generate().slice(0, 5);
			exist = socket.adapter.rooms[room_id];
		}
		socket.join(room_id);
		callback(room_id);
	});

	socket.on('join_room', function (room_id, username, callback) {
		username_socket_pair[socket.id] = username;

		// https://github.com/rase-/socket.io-php-emitter/issues/18
		let exist = socket.adapter.rooms[room_id];
		if (exist) {
			socket.join(room_id);
			// io.in is to all sockets including the sender
			// io.to is to all sockets excluding the sender
			io.to(room_id).emit('lobby_new_user', room_id);
			callback('room exists');
		} else {
			callback("room doesn't exist", room_id);
		}
	});

	socket.on('get_lobby_users', function (room_id, callback) {
		// https://stackoverflow.com/questions/9352549/getting-how-many-people-are-in-a-chat-room-in-socket-io#24425207
		let room = io.sockets.adapter.rooms[room_id];
		if (!room) {
			callback('Lobby error');
			return;
		}
		// from the room, get a list of users (ie. the sockets)
		let user_socket_list = Object.keys(room.sockets);

		let user_username_list = [];
		user_socket_list.forEach((user_socket) => {
			user_username_list.push(username_socket_pair[user_socket]);
		});

		callback(user_username_list);
	});
};
