import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { Segment, Input, Button, Grid } from 'semantic-ui-react';

// https://stackoverflow.com/questions/36120119/reactjs-how-to-share-a-websocket-between-components
import socket from './socketConfig';

export default class Play extends PureComponent {
	constructor(props) {
		super(props);
		this.createRoom = this.createRoom.bind(this);
		this.joinRoom = this.joinRoom.bind(this);
		this.handleRoomInputChange = this.handleRoomInputChange.bind(this);
	}

	state = {
		room_joined: false,
		input_room_id: '',
		no_room: false,
		joined_room_id: '',
	};

	// https://stackoverflow.com/questions/51632679/retrieve-input-value-from-action-onclick-in-semanticui
	handleRoomInputChange(event) {
		this.setState({
			input_room_id: event.target.value,
		});
	}

	createRoom() {
		const { selfUser } = this.props;
		let parent = this;
		socket.emit('create_room', selfUser.username, function (created_room_id) {
			if (created_room_id) {
				parent.setState({
					room_joined: true,
					joined_room_id: created_room_id,
				});

				parent.props.updateLobbyStatus(true);
				window.sessionStorage.setItem('roomID', created_room_id);
			}
		});

		// this.props.updateLobbyStatus(true);
		// window.localStorage.setItem('roomID', joined_room_id);
		// console.log('from play storage ', window.localStorage);
	}

	joinRoom(parent) {
		const { selfUser } = this.props;
		socket.emit(
			'join_room',
			this.state.input_room_id,
			selfUser.username,
			function (data) {
				if (data === "room doesn't exist") {
					parent.setState({
						no_room: true,
					});
				} else if (data === 'room exists') {
					parent.setState({
						no_room: false,
						joined_room_id: parent.state.input_room_id,
						room_joined: true,
					});
					parent.props.updateLobbyStatus(true);
					window.sessionStorage.setItem('roomID', parent.state.input_room_id);
				}
			}
		);
	}

	render() {
		const { room_joined, no_room, joined_room_id } = this.state;
		const { selfUser } = this.props;

		if (!selfUser) {
			return <Redirect to='/' />;
		}

		if (room_joined) {
			return (
				<Redirect
					to={{
						pathname: '/lobby',
						state: { room_id: joined_room_id },
					}}
				/>
			);
		}

		return (
			<Segment placeholder>
				<Grid>
					<Grid.Row columns={2}>
						{/* {joined_room_id ? (
							<p style={{ color: 'red' }}>{joined_room_id}</p>
						) : null} */}
						<Grid.Column>
							<Button
								color='teal'
								content='Create New Lobby'
								icon='add'
								labelPosition='left'
								style={{ marginBottom: '10px' }}
								onClick={this.createRoom}
							/>
						</Grid.Column>
						{/* <Grid.Column>
							<Button color='teal'>Join Random Room</Button>
						</Grid.Column> */}
						<Grid.Column>
							<Input
								action={{
									color: 'teal',
									content: 'Join',
									onClick: () => this.joinRoom(this),
								}}
								icon='search'
								iconPosition='left'
								placeholder='Lobby ID'
								centered='true'
								onChange={this.handleRoomInputChange}
							/>
							{no_room ? (
								<p style={{ color: 'red' }}>
									Room ID not found. Please try again.
								</p>
							) : null}
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Segment>
		);
	}
}
