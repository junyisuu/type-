import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { Segment, Input, Button, Grid } from 'semantic-ui-react';

export default class Play extends PureComponent {
	state = {
		created: false,
	};

	async createRoom(event) {
		event.preventDefault();

		// const { selfUser } = this.props;
		const { apiPath } = this.props;
		try {
			const res = await fetch(`${apiPath}/createRoom`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			console.log(res);
			this.setState({
				created: true,
			});
		} catch (err) {
			console.log(err);
		}
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
								onClick={this.createRoom.bind(this)}
							/>
						</Grid.Column>
						{/* <Grid.Column>
							<Button color='teal'>Join Random Room</Button>
						</Grid.Column> */}
						<Grid.Column>
							<Input
								action={{ color: 'teal', content: 'Join' }}
								icon='search'
								iconPosition='left'
								placeholder='Room ID'
								centered='true'
							/>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row></Grid.Row>
				</Grid>
			</Segment>
		);
	}
}
