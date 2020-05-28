import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { Segment, Input, Button, Grid } from 'semantic-ui-react';

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

const shortid = require('shortid');

export default class Play extends PureComponent {
	constructor(props) {
		super(props);
		this.createRoom = this.createRoom.bind(this);
		this.joinRoom = this.joinRoom.bind(this);
		this.handleRoomInputChange = this.handleRoomInputChange.bind(this);
	}

	state = {
		created: false,
		room_id: '',
		no_room: false,
	};

	// https://stackoverflow.com/questions/51632679/retrieve-input-value-from-action-onclick-in-semanticui
	handleRoomInputChange(event) {
		this.setState({
			room_id: event.target.value,
		});
	}

	createRoom() {
		socket.emit('create_room');
	}

	joinRoom(parent) {
		socket.emit('join_room', this.state.room_id, function (data) {
			if (data === "room doesn't exist") {
				parent.setState({
					no_room: true,
				});
			} else if (data === 'room exists') {
				parent.setState({
					no_room: false,
				});
			}
		});
	}

	render() {
		const { created, no_room } = this.state;

		if (created) {
			return <Redirect to='/lobby' />;
		}

		return (
			<Segment placeholder>
				<Grid>
					<Grid.Row columns={2} stackable='true'>
						<Grid.Column>
							<Button
								color='teal'
								content='Create New Room'
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
								placeholder='Room ID'
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
					<Grid.Row></Grid.Row>
				</Grid>
			</Segment>
		);
	}
}
