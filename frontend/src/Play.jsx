import React, { PureComponent, Fragment } from 'react';
import { Segment, Divider, Input, Button, Grid, Form } from 'semantic-ui-react';

export default class Play extends PureComponent {
	render() {
		return (
			<Segment placeholder>
				<Grid centered columns={2} relaxed='very' stackable>
					<Grid.Column>
						<Button
							color='teal'
							content='Create New Room'
							icon='add'
							labelPosition='left'
						/>
					</Grid.Column>

					<Grid.Column verticalAlign='middle'>
						<Input
							action={{ color: 'blue', content: 'Join' }}
							icon='search'
							iconPosition='left'
							placeholder='Room ID'
						/>
					</Grid.Column>
				</Grid>

				<Divider vertical>Or</Divider>
			</Segment>
		);
	}
}
