import React, { PureComponent, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Icon, Card, Container } from 'semantic-ui-react';

import socket from './socketConfig';

export default class Lobby extends PureComponent {
	constructor(props) {
		super(props);
		this.leaveRoom = this.leaveRoom.bind(this);
	}

	state = {
		// https://stackoverflow.com/questions/52064303/reactjs-pass-props-with-redirect-component
		// room_id: this.props.location.state.room_id,
		room_id: '',
		lobby_users: [],
	};

	rejoinRoom(room_id) {
		const { selfUser } = this.props;
		const parent = this;
		socket.emit('join_room', room_id, selfUser.username, function (data) {
			if (data === 'room exists') {
				parent.setState({
					room_id: room_id,
				});
				console.log('rejoined room');
			} else {
				console.log(data);
			}
		});

		this.props.updateLobbyStatus(true);
		window.sessionStorage.setItem('roomID', room_id);
	}

	componentDidMount() {
		let room_id = '';
		console.log('local storage...', window.sessionStorage);
		if (window.sessionStorage.getItem('roomID')) {
			console.log('true');
			room_id = window.sessionStorage.getItem('roomID');
			this.rejoinRoom(room_id);
		} else {
			console.log('false');
			room_id = this.props.location.state.room_id;
		}
		console.log('roomID check ', room_id);

		this.setState({
			room_id: room_id,
			lobby_users: [],
		});

		const parent = this;
		socket.emit('get_lobby_users', room_id, function (usernames) {
			console.log('usernames', usernames);
			if (usernames === 'Lobby error') {
				console.log('Error getting lobby users');
			} else {
				parent.setState({
					lobby_users: usernames,
				});
			}
		});

		// when a new user has joined the lobby
		socket.on('lobby_new_user', function (room_id) {
			socket.emit('get_lobby_users', room_id, function (usernames) {
				if (usernames === 'Lobby error') {
					console.log('lobby error');
				} else {
					parent.setState({
						lobby_users: usernames,
					});
				}
			});
		});

		// update lobby user list when a user has disconnected
		socket.on('user_disconnect', function (room_id) {
			socket.emit('get_lobby_users', room_id, function (usernames) {
				if (usernames === 'Lobby error') {
					console.log('lobby error');
				} else {
					parent.setState({
						lobby_users: usernames,
					});
				}
			});
		});
	}

	leaveRoom() {
		const { room_id } = this.state;
		window.sessionStorage.setItem('roomID', '');
		socket.emit('leave_room', room_id);

		this.props.updateLobbyStatus(false);
	}

	render() {
		const { selfUser } = this.props;

		const { room_id, lobby_users } = this.state;

		if (!selfUser) {
			return <Redirect to='/' />;
		}

		return (
			<Fragment>
				<h1>Lobby</h1>
				<p>Invite your friends with the Room ID: {room_id}</p>
				<Container>
					<Card.Group itemsPerRow={6}>
						{lobby_users.map((user) => (
							<Card centered>
								<Card.Header textAlign={'center'}>{user}</Card.Header>
							</Card>
						))}
					</Card.Group>
				</Container>
				<Container style={{ marginTop: '20px' }}>
					<Link
						to={{
							pathname: '/type',
							state: {
								room_id: room_id,
								lobby_users: lobby_users,
							},
						}}
					>
						<Button icon labelPosition='right'>
							Play
							<Icon name='play' />
						</Button>
					</Link>

					<Link to='/play'>
						<Button icon labelPosition='right' onClick={this.leaveRoom}>
							Leave Lobby
							<Icon name='x' />
						</Button>
					</Link>
				</Container>
			</Fragment>
		);
	}
}
