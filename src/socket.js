const shortid = require('shortid');
// const axios = require('axios');

const { Excerpt } = require('../src/database');

// https://stackoverflow.com/questions/24815106/can-i-separate-socket-io-event-listeners-into-different-modules
module.exports = function (socket, io, username_socket_pair, all_rooms) {
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
			io.to(room_id).emit(
				'user_disconnect',
				room_id,
				username_socket_pair[socket.id]
			);

			all_rooms[room_id].user_count--;

			// if user is disconnecting from a single user lobby, delete the lobby from all_rooms
			if (Object.keys(io.sockets.adapter.rooms[room_id].sockets).length === 1) {
				delete all_rooms[room_id];
			}
		}
	});

	socket.on('leave_room', function (room_id) {
		try {
			socket.leave(room_id);
			io.to(room_id).emit(
				'user_disconnect',
				room_id,
				username_socket_pair[socket.id]
			);
		} catch (e) {
			console.log('Error - leave room: ', e);
		}
	});

	socket.on('disconnect', function () {
		delete username_socket_pair[socket.id];
		console.log('User Disconnected');
	});

	socket.on('get_excerpt', async function (room_id, callback) {
		const { excerpt_obj } = all_rooms[room_id];
		callback(excerpt_obj);
	});

	socket.on('randomize_excerpt', async function (room_id) {
		// gets called once for every player that ends race
		let next_excerpt_obj = await getExcerpt();
		all_rooms[room_id].excerpt_obj = next_excerpt_obj[0];
	});

	socket.on('ready', function (room_id, username, ready) {
		io.in(room_id).emit('ready_toggle', username, ready);
		if (!all_rooms[room_id]) {
			console.log('Error finding room data');
			return;
		}

		if (ready) {
			all_rooms[room_id].ready_count++;
		} else {
			all_rooms[room_id].ready_count--;
		}

		if (all_rooms[room_id].ready_count === all_rooms[room_id].user_count) {
			// reset the rank every time a race starts
			all_rooms[room_id].race_rank = 1;

			// https://stackoverflow.com/questions/42398795/countdown-timer-broadcast-with-socket-io-and-node-js
			io.in(room_id).emit('race_starting');
			let raceCountdown = setInterval(function () {
				io.in(room_id).emit(
					'start_counter',
					all_rooms[room_id].start_race_counter
				);
				all_rooms[room_id].start_race_counter--;
				if (all_rooms[room_id].start_race_counter === 0) {
					io.in(room_id).emit('race_started');
					clearInterval(raceCountdown);
					all_rooms[room_id].start_race_counter = 10;
				}
			}, 1000);
		}
	});

	socket.on('create_room', async function (username, callback) {
		username_socket_pair[socket.id] = username;

		let room_id = shortid.generate().slice(0, 5);
		let exist = socket.adapter.rooms[room_id];
		while (exist) {
			room_id = shortid.generate().slice(0, 5);
			exist = socket.adapter.rooms[room_id];
		}
		socket.join(room_id);

		let next_excerpt_obj = await getExcerpt();
		all_rooms[room_id] = {
			room_id: room_id,
			excerpt_obj: next_excerpt_obj[0],
			in_progress: false,
			ready_count: 0,
			user_count: 1,
			start_race_counter: 10,
			race_rank: 1,
		};

		callback(room_id);
	});

	async function getExcerpt() {
		const excerpt = await Excerpt.aggregate().sample(1).exec();
		return excerpt;
	}

	socket.on('join_room', function (room_id, username, callback) {
		username_socket_pair[socket.id] = username;

		// https://github.com/rase-/socket.io-php-emitter/issues/18
		let exist = socket.adapter.rooms[room_id];
		if (exist) {
			socket.join(room_id);
			all_rooms[room_id].user_count++;
			// io.in is to all sockets including the sender
			// io.to is to all sockets excluding the sender
			io.to(room_id).emit('lobby_new_user', room_id, username);
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

	socket.on('joined_race', function (room_id, username) {
		io.to(room_id).emit('add_user', username);
	});

	socket.on('keypress', function (room_id, username, percentComplete) {
		socket.broadcast
			.to(room_id)
			.emit('progress_update', username, percentComplete);
	});

	socket.on('finished_race', function (room_id, username, wpm) {
		let rank = all_rooms[room_id].race_rank;
		io.in(room_id).emit('update_race_stats', username, wpm, rank);
		all_rooms[room_id].race_rank++;
	});
};
