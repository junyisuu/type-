import React, { PureComponent, Fragment } from 'react';

export default class Lobby extends PureComponent {
	state = {};

	componentDidMount() {
		const { createRoom } = this.props.location.state;
	}

	render() {
		return (
			<Fragment>
				<h1>Lobby</h1>
				<p>This is a placeholder</p>
			</Fragment>
		);
	}
}
