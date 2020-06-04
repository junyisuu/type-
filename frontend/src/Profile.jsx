import React, { PureComponent, Fragment } from 'react';
import { Redirect } from 'react-router-dom';

export default class Profile extends PureComponent {
	render() {
		const { selfUser } = this.props;

		if (!selfUser) {
			return <Redirect to='/' />;
		}

		return (
			<Fragment>
				<h1>Profile Page</h1>
				<p>This is a placeholder</p>
			</Fragment>
		);
	}
}
