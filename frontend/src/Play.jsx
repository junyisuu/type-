import React, { PureComponent, Fragment } from 'react';
import { Segment, Divider, Input, Button, Grid, Form } from 'semantic-ui-react';

export default class Play extends PureComponent {
	render() {
		return (
			<Segment placeholder>
				<Grid>
					<Grid.Row columns={3} stackable='true'>
						<Grid.Column>
							<Button
								color='teal'
								content='Create New Room'
								icon='add'
								labelPosition='left'
								style={{ marginBottom: '10px' }}
							/>
						</Grid.Column>
						<Grid.Column>
							<Button color='teal'>Join Random Room</Button>
						</Grid.Column>
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
