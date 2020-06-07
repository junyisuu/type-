import React, { PureComponent, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Icon, Card, Container } from 'semantic-ui-react';

import socket from './socketConfig';

export default class Lobby extends PureComponent {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.leaveRoom = this.leaveRoom.bind(this);
		this.toggleReady = this.toggleReady.bind(this);
	}

	state = {
		// https://stackoverflow.com/questions/52064303/reactjs-pass-props-with-redirect-component
		// room_id: this.props.location.state.room_id,
		room_id: '',
		lobby_users: {},
		redirectToPlay: false,
		ready: false,
	};

	async rejoinRoom(room_id) {
		// https://www.freecodecamp.org/news/how-to-write-a-javascript-promise-4ed8d44292b8/#:~:text=A%20promise%20is%20simply%20an,two%20arguments%3A%20resolve%20and%20reject%20.
		return new Promise((resolve, reject) => {
			const { selfUser } = this.props;
			const parent = this;

			socket.emit('join_room', room_id, selfUser.username, function (data) {
				if (data === 'room exists') {
					if (this._isMounted) {
						parent.setState({
							room_id: room_id,
						});
					}

					console.log('rejoined room');

					parent.props.updateLobbyStatus(true);
					window.sessionStorage.setItem('roomID', room_id);

					resolve('rejoined room');
				} else if (data === "room doesn't exist") {
					console.log(data);
					window.sessionStorage.setItem('roomID', '');
					reject(data);
				}
			});
		});
	}

	async componentDidMount() {
		this._isMounted = true;
		let room_id = '';
		let joined = true;
		const { inLobby } = this.props;
		console.log('local storage...', window.sessionStorage);

		// correct use of inLobby?
		console.log('In a lobby? ', inLobby);

		// upon page refresh, props are refreshed and therefore inLobby will be false
		// right now if user navigates back to lobby from type page, they will re-join as a new user to that socket room
		if (window.sessionStorage.getItem('roomID')) {
			console.log('true');
			room_id = window.sessionStorage.getItem('roomID');
			try {
				await this.rejoinRoom(room_id);
				joined = true;
			} catch (err) {
				console.log(err);
				joined = false;
			}
		} else {
			console.log('false');
			room_id = this.props.location.state.room_id;
		}
		console.log('roomID check ', room_id);
		console.log('joined check ', joined);

		if (!joined) {
			this.setState({
				redirectToPlay: true,
			});
		} else {
			console.log('in here');
			this.setState({
				room_id: room_id,
				lobby_users: {},
				redirectToPlay: false,
			});

			const parent = this;
			socket.emit('get_lobby_users', room_id, function (usernames) {
				if (usernames === 'Lobby error') {
					console.log('Error getting lobby users');
				} else {
					// https://stackoverflow.com/questions/2274242/how-to-use-a-variable-for-a-key-in-a-javascript-object-literal
					// initialize players object using the list of usernames
					let players = {};
					console.log('usernames ', usernames);
					for (let i = 0; i < usernames.length; i++) {
						players[usernames[i]] = {
							username: usernames[i],
							percentComplete: 0,
							wpm: 0,
							finished: false,
							ready: false,
						};
					}
					console.log('players ', players);
					parent.setState({
						lobby_users: players,
					});
					window.sessionStorage.setItem('lobby_users', JSON.stringify(players));
				}
			});

			// when a new user has joined the lobby
			socket.on('lobby_new_user', function (room_id, username) {
				parent.setState((prevState) => {
					let lobby_users = Object.assign({}, prevState.lobby_users);
					lobby_users[username] = {
						username: username,
						percentComplete: 0,
						wpm: 0,
						finished: false,
						ready: false,
					};
					return { lobby_users };
				});
				window.sessionStorage.setItem(
					'lobby_users',
					JSON.stringify(parent.state.lobby_users)
				);
			});

			// update lobby user list when a user has disconnected
			socket.on('user_disconnect', function (room_id, username) {
				parent.setState((prevState) => {
					let lobby_users = Object.assign({}, prevState.lobby_users);
					delete lobby_users[username];
					return { lobby_users };
				});
				window.sessionStorage.setItem(
					'lobby_users',
					JSON.stringify(parent.state.lobby_users)
				);
			});

			socket.on('ready_toggle', function (username, ready_status) {
				console.log('got ready event ', ready_status);
				parent.setState((prevState) => {
					let lobby_users = Object.assign({}, prevState.lobby_users);
					lobby_users[username].ready = ready_status;
					return { lobby_users };
				});
				window.sessionStorage.setItem(
					'lobby_users',
					JSON.stringify(parent.state.lobby_users)
				);
			});
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	leaveRoom() {
		const { room_id } = this.state;
		window.sessionStorage.setItem('roomID', '');
		socket.emit('leave_room', room_id);

		this.props.updateLobbyStatus(false);
	}

	toggleReady() {
		const { room_id, ready } = this.state;
		const { selfUser } = this.props;
		this.setState((prevState) => ({ ready: !prevState.ready }));
		socket.emit('ready', room_id, selfUser.username, !ready);
	}

	render() {
		const { selfUser } = this.props;

		const { room_id, lobby_users, redirectToPlay, ready } = this.state;

		if (!selfUser) {
			return <Redirect to='/' />;
		}

		if (redirectToPlay) {
			return <Redirect to='/play' />;
		}

		return (
			<Fragment>
				<h1>Lobby</h1>
				<p>Invite your friends with the Room ID: {room_id}</p>
				<Container>
					<Card.Group itemsPerRow={6}>
						{Object.keys(lobby_users).map((user) => (
							<Card centered key={lobby_users[user].username}>
								<Card.Content>
									<Card.Header textAlign={'center'}>
										{lobby_users[user].username}
									</Card.Header>
								</Card.Content>

								<Card.Content extra>
									<p style={{ textAlign: 'center' }}>
										{lobby_users[user].ready ? 'Ready' : 'Not Ready'}
									</p>
								</Card.Content>
							</Card>
						))}
					</Card.Group>
				</Container>
				<Container style={{ marginTop: '20px' }}>
					<Button
						toggle
						active={ready}
						onClick={this.toggleReady}
						icon
						labelPosition='right'
					>
						Ready
						<Icon name='check square outline' />
					</Button>

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
