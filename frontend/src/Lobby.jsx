import React, { PureComponent, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Icon, Card, Container } from 'semantic-ui-react';

import socket from './socketConfig';

export default class Lobby extends PureComponent {
	state = {
		// https://stackoverflow.com/questions/52064303/reactjs-pass-props-with-redirect-component
		room_id: this.props.location.state.room_id,
		lobby_users: [],
	};

	componentDidMount() {
		const { room_id } = this.state;
		const parent = this;
		socket.emit('get_lobby_users', room_id, function (usernames) {
			parent.setState({
				lobby_users: usernames,
			});
		});
		socket.on('lobby_new_user', function (room_id) {
			socket.emit('get_lobby_users', room_id, function (usernames) {
				if (usernames == 'Lobby error') {
					console.log('lobby error');
				} else {
					parent.setState({
						lobby_users: usernames,
					});
				}
			});
		});
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
				<Container style={{ 'margin-top': '20px' }}>
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
						<Button icon labelPosition='right'>
							Exit Lobby
							<Icon name='x' />
						</Button>
					</Link>
				</Container>
			</Fragment>
		);
	}
}
