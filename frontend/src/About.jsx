import React, { PureComponent, Fragment } from 'react';
import { Container, Grid, Image } from 'semantic-ui-react';
// import './About.css';

import SignUpImg from './images/screenshots/sign_up.gif';
import CreateJoinImg from './images/screenshots/create_join.gif';
import ReadyImg from './images/screenshots/ready.gif';
import RaceImg from './images/screenshots/race.gif';
import LeaderboardImg from './images/screenshots/leaderboard.gif';

export default class About extends PureComponent {
	render() {
		return (
			<Fragment>
				<h1>About</h1>
				<Container className='landing_about'>
					<p>
						Typedash is a online multiplayer type racing game created using the
						MERN stack (MongoDB, Express, React, Node) and hosted on AWS EC2. It
						utilizes Socket.IO for real-time race progress as well as lobby
						management. Its features include:
						<ul>
							<li>User registration, email verification, and login</li>
							<li>Online type racing against other players</li>
							<li>Create and join private lobbies</li>
							<li>Real-time race progress</li>
							<li>Race statistics</li>
							<li>Lobby and excerpt leaderboards</li>
							<li>Thousands of excerpts to type from</li>
						</ul>
					</p>
					<p>
						Learn more about the project by visiting:&nbsp;
						<a href='https://github.com/kshiftw/type-'>
							<u>https://github.com/kshiftw/type-</u>
						</a>
					</p>
				</Container>
				<Container>
					<Grid>
						<Grid.Row style={{ height: '70vh' }}>
							<Grid.Column width={6} verticalAlign='middle' textAlign='center'>
								<h2>Create an account</h2>
							</Grid.Column>
							<Grid.Column width={10}>
								<Image src={SignUpImg}></Image>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row style={{ height: '70vh' }}>
							<Grid.Column width={10}>
								<Image src={CreateJoinImg}></Image>
							</Grid.Column>
							<Grid.Column width={6} verticalAlign='middle' textAlign='center'>
								<h2>Create a room or join one</h2>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row style={{ height: '70vh' }}>
							<Grid.Column width={6} verticalAlign='middle' textAlign='center'>
								<h2>Get ready to race</h2>
							</Grid.Column>
							<Grid.Column width={10}>
								<Image src={ReadyImg}></Image>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row style={{ height: '70vh' }}>
							<Grid.Column width={10}>
								<Image src={RaceImg}></Image>
							</Grid.Column>
							<Grid.Column width={6} verticalAlign='middle' textAlign='center'>
								<h2>Type!</h2>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row style={{ height: '70vh' }}>
							<Grid.Column width={6} verticalAlign='middle' textAlign='center'>
								<h2>View race standings and statistics</h2>
							</Grid.Column>
							<Grid.Column width={10}>
								<Image src={LeaderboardImg}></Image>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Container>
			</Fragment>
		);
	}
}
