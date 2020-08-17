import React, { PureComponent, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import {
	Button,
	Icon,
	Card,
	Container,
	Message,
	Popup,
} from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import socket from './socketConfig';

export default class Lobby extends PureComponent {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.leaveRoom = this.leaveRoom.bind(this);
		this.toggleReady = this.toggleReady.bind(this);
	}

	state = {
		room_id: '',
		lobby_users: {},
		redirectToPlay: false,
		ready: false,
		race_starting: false,
		countdown: 10,
		race_started: false,
	};

	async rejoinRoom(room_id) {
		// https://www.freecodecamp.org/news/how-to-write-a-javascript-promise-4ed8d44292b8/#:~:text=A%20promise%20is%20simply%20an,two%20arguments%3A%20resolve%20and%20reject%20.
		return new Promise((resolve, reject) => {
			const { selfUser } = this.props;
			const parent = this;

			// Emit a join_room event in socket
			socket.emit('join_room', room_id, selfUser.username, function (data) {
				// If the room exists, set the room_id in state and update sessionStorage
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

		// Upon page refresh, props are refreshed and therefore inLobby will be false.
		// right now if user navigates back to lobby from type page, they will re-join as a new user to that socket room
		if (window.sessionStorage.getItem('roomID')) {
			// If there is a roomID is sessionStorage, get it and try to rejoin the room
			room_id = window.sessionStorage.getItem('roomID');
			try {
				await this.rejoinRoom(room_id);
				joined = true;
			} catch (err) {
				console.log(err);
				joined = false;
			}
		} else {
			// If the current session doesn't have a roomID stored, then get it from the props
			room_id = this.props.location.state.room_id;
		}

		// Redirect to play if we weren't able to rejoin room
		if (!joined) {
			this.setState({
				redirectToPlay: true,
			});
		} else {
			this.setState({
				room_id: room_id,
				lobby_users: {},
				redirectToPlay: false,
			});

			// Save 'this' into variable, parent, for later use when the scope changes within socket function
			const parent = this;

			// Get a list of the users in the lobby
			socket.emit('get_lobby_users', room_id, function (usernames) {
				if (usernames === 'Lobby error') {
					console.log('Error getting lobby users');
				} else {
					// https://stackoverflow.com/questions/2274242/how-to-use-a-variable-for-a-key-in-a-javascript-object-literal
					// initialize players object using the list of usernames
					let players = {};
					console.log('usernames ', usernames);

					// For every username, initialize the players object which contains multiple player objects
					for (let i = 0; i < usernames.length; i++) {
						players[usernames[i]] = {
							username: usernames[i],
							percentComplete: 0,
							wpm: 0,
							incorrect_count: 0,
							finished: false,
							ready: false,
							rank: 0,
						};
					}
					console.log('players ', players);

					// Save players object to state
					parent.setState({
						lobby_users: players,
					});

					// Store the players object in sessionStorage for future retrieval
					window.sessionStorage.setItem('lobby_users', JSON.stringify(players));
				}
			});

			// When a new user has joined our lobby, update the lobby_users variable in state
			socket.on('lobby_new_user', function (room_id, username) {
				parent.setState((prevState) => {
					// Get the previous state of lobby_users
					let lobby_users = Object.assign({}, prevState.lobby_users);

					// Add the new users to the lobby_users object
					lobby_users[username] = {
						username: username,
						percentComplete: 0,
						wpm: 0,
						incorrect_count: 0,
						finished: false,
						ready: false,
						rank: 0,
					};

					// Return the modified lobby_users object
					return { lobby_users };
				});

				// Update sessionStorage with new lobby_users object
				window.sessionStorage.setItem(
					'lobby_users',
					JSON.stringify(parent.state.lobby_users)
				);
			});

			// Update lobby user list when a user has disconnected
			socket.on('user_disconnect', function (room_id, username) {
				parent.setState((prevState) => {
					// Get previous state of lobby_users
					let lobby_users = Object.assign({}, prevState.lobby_users);

					// Delete the user from the object
					delete lobby_users[username];
					return { lobby_users };
				});

				// Update sessionStorage
				window.sessionStorage.setItem(
					'lobby_users',
					JSON.stringify(parent.state.lobby_users)
				);
			});

			// When another socket has ready toggled
			socket.on('ready_toggle', function (username, ready_status) {
				// Change the ready_status in the lobby_users object for that username
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

			// Handle race starting
			socket.on('race_starting', function () {
				parent.setState({
					race_starting: true,
				});
			});

			// When race start is counting down, get the countdown and set to state
			socket.on('start_counter', function (countdown) {
				parent.setState({
					countdown: countdown,
				});
			});

			// Update state when race has started
			socket.on('race_started', function () {
				parent.setState({
					race_started: true,
				});
			});
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	leaveRoom() {
		const { room_id } = this.state;

		// Clear sessionStorage of the saved roomID
		window.sessionStorage.setItem('roomID', '');

		// Emit 'leave_room' event for other sockets to register
		socket.emit('leave_room', room_id);

		// Update parent prop inLobby status
		this.props.updateLobbyStatus(false);
	}

	toggleReady() {
		const { room_id, ready } = this.state;
		const { selfUser } = this.props;
		this.setState((prevState) => ({ ready: !prevState.ready }));

		// Emit 'ready' event for other sockets to receive ready status
		socket.emit('ready', room_id, selfUser.username, !ready);
	}

	render() {
		const { selfUser } = this.props;

		const {
			room_id,
			lobby_users,
			redirectToPlay,
			ready,
			race_starting,
			countdown,
			race_started,
		} = this.state;

		// If there is no valid user logged in, redirect to home page
		if (!selfUser) {
			return <Redirect to='/' />;
		}

		// Redirect to play page
		if (redirectToPlay) {
			return <Redirect to='/play' />;
		}

		// Once race has started, redirect to /type component and pass room_id and lobby_users list
		if (race_started) {
			return (
				<Redirect
					to={{
						pathname: '/type',
						state: {
							room_id: room_id,
							lobby_users: lobby_users,
						},
					}}
				/>
			);
		}

		return (
			<Fragment>
				<div className='lobby_background'></div>
				<h1>Lobby</h1>
				<CopyToClipboard text={room_id}>
					<p style={{ marginBottom: '3px' }}>
						Invite your friends with the Lobby ID:&nbsp;
						<Popup
							content='Copied'
							position='right center'
							on='click'
							trigger={
								<Button basic compact>
									{room_id}
								</Button>
							}
						/>
					</p>
				</CopyToClipboard>
				{race_starting ? (
					<Message positive compact size='tiny'>
						<Message.Header>Race starting in {countdown}</Message.Header>
					</Message>
				) : (
					<Message compact size='tiny'>
						<Message.Header>
							Race will start when all players are ready.
						</Message.Header>
					</Message>
				)}

				<Container>
					<Card.Group itemsPerRow={6}>
						{Object.keys(lobby_users).map((user) => (
							<Card centered key={lobby_users[user].username}>
								<Card.Content>
									<Card.Header textAlign={'center'}>
										{lobby_users[user].username}
									</Card.Header>
								</Card.Content>

								<Card.Content extra textAlign='center'>
									{lobby_users[user].ready ? (
										<p>
											Ready <Icon style={{ color: 'green' }} name='check' />
										</p>
									) : (
										<p>Not Ready</p>
									)}
								</Card.Content>
							</Card>
						))}
					</Card.Group>
				</Container>
				<Container style={{ marginTop: '20px' }}>
					{race_starting ? (
						<Button toggle disabled icon labelPosition='right'>
							Ready
							<Icon name='check square outline' />
						</Button>
					) : (
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
					)}

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
