import React, { PureComponent, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';

export default class Lobby extends PureComponent {
	state = {
		excerpts: [],
	};

	async componentWillMount() {
		// GET request - retrieve all topics
		const { apiPath } = this.props;
		console.log('trying to retrieve');
		const res = await fetch(`${apiPath}/excerpts`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const { excerpts } = await res.json();
		this.setState({
			excerpts: excerpts,
		});
		console.log('after', this.state.excerpts);
	}

	render() {
		const { selfUser } = this.props;

		const { excerpts } = this.state;
		// console.log('rendering', excerpts[3]);

		if (!selfUser) {
			return <Redirect to='/' />;
		}

		return (
			<Fragment>
				<h1>Lobby</h1>
				{excerpts.map((excerpt) => (
					<p>{excerpt.Excerpt}</p>
				))}
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
