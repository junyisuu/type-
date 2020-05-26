import React, { PureComponent, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';

export default class Lobby extends PureComponent {
	// state = {};

	// componentDidMount() {
	// 	const { createRoom } = this.props.location.state;
	// }

	render() {
		return (
			<Fragment>
				<h1>Lobby</h1>
				<div>
					<Link to='/type'>
						<Button icon labelPosition='right'>
							Play
							<Icon name='play' />
						</Button>
					</Link>
				</div>
			</Fragment>
		);
	}
}
