import React, { PureComponent, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';

export default class Lobby extends PureComponent {
	state = {
		room_id: this.props.location.state.room_id,
	};

	render() {
		const { selfUser } = this.props;

		const { room_id } = this.state;

		if (!selfUser) {
			return <Redirect to='/' />;
		}

		return (
			<Fragment>
				<h1>Lobby</h1>
				<p>Invite your friends with the Room ID: {room_id}</p>
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
