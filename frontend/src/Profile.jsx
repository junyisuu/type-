import React, { PureComponent, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { Card } from 'semantic-ui-react';

export default class Profile extends PureComponent {
	constructor(props) {
		super(props);

		const { selfUser } = this.props;

		this.state = {
			username: selfUser.username,
			averageWPM: 0,
			racesCompleted: 0,
			racesWon: 0,
		};
	}

	async componentDidMount() {
		const { selfUser, apiPath } = this.props;
		try {
			const res = await fetch(
				`${apiPath}/profile?username=${selfUser.username}`
			);
			const { user } = await res.json();
			this.setState({
				averageWPM: user.averageWPM,
				racesCompleted: user.racesCompleted,
				racesWon: user.racesWon,
			});
		} catch (err) {
			console.log('error', err);
		}
	}

	render() {
		const { selfUser } = this.props;
		const { username, averageWPM, racesCompleted, racesWon } = this.state;

		if (!selfUser) {
			return <Redirect to='/' />;
		}

		return (
			<Fragment>
				<div class='profile_background'></div>
				<h1>Profile Page</h1>
				<Card>
					<Card.Content>
						<Card.Header textAlign={'center'}>{username}</Card.Header>
					</Card.Content>
					<Card.Content>
						<Card.Description>Average WPM: {averageWPM}</Card.Description>
						<Card.Description>
							Races Completed: {racesCompleted}
						</Card.Description>
						<Card.Description>Races Won: {racesWon}</Card.Description>
					</Card.Content>
				</Card>
			</Fragment>
		);
	}
}
