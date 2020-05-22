import React, { PureComponent, Fragment } from 'react';

export default class Play extends PureComponent {
	render() {
		return (
			<Segment basic textAlign='center'>
				<Input
					action={{ color: 'blue', content: 'Search' }}
					icon='search'
					iconPosition='left'
					placeholder='Order #'
				/>

				<Divider horizontal>Or</Divider>

				<Button
					color='teal'
					content='Create New Order'
					icon='add'
					labelPosition='left'
				/>
			</Segment>
		);
	}
}
