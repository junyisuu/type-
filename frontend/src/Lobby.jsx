import React, { PureComponent, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';

export default class Lobby extends PureComponent {
	render() {
		const { selfUser } = this.props;

		if (!selfUser) {
			return <Redirect to='/' />;
		}

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
