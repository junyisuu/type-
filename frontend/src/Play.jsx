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
	};

	// https://stackoverflow.com/questions/51632679/retrieve-input-value-from-action-onclick-in-semanticui
	handleRoomInputChange(event) {
		this.setState({
			room_id: event.target.value,
		});
	}

	createRoom() {
		let room_id = shortid.generate();
		room_id = room_id.slice(0, 5);
		socket.emit('create_room', room_id);
	}

	joinRoom() {
		console.log('trying to join', this.state.room_id);
	}

	render() {
		const { created } = this.state;

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
									onClick: () => this.joinRoom(),
								}}
								icon='search'
								iconPosition='left'
								placeholder='Room ID'
								centered='true'
								onChange={this.handleRoomInputChange}
							/>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row></Grid.Row>
				</Grid>
			</Segment>
		);
	}
}
