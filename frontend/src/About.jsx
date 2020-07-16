import React, { PureComponent, Fragment } from 'react';
import { Container, Grid } from 'semantic-ui-react';
// import './About.css';

export default class About extends PureComponent {
	render() {
		return (
			<Fragment>
				<h1>How to Play</h1>
				<Container>
					<Grid>
						<Grid.Row>
							<Grid.Column width={6}>
								<p>1. Create an account</p>
							</Grid.Column>
							<Grid.Column width={10}>Insert Picture</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column width={6}>
								<p>2. Create a room or join an existing one</p>
							</Grid.Column>
							<Grid.Column width={10}>Insert Picture</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column width={6}>
								<p>3. Get ready to race</p>
							</Grid.Column>
							<Grid.Column width={10}>Insert Picture</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column width={6}>
								<p>4. Type!</p>
							</Grid.Column>
							<Grid.Column width={10}>Insert Picture</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column width={6}>
								<p>5. View the race standings and statistics</p>
							</Grid.Column>
							<Grid.Column width={10}>Insert Picture</Grid.Column>
						</Grid.Row>
					</Grid>
				</Container>
				<Container className='landing_about'>
					<h1>About</h1>
					<p>Create using MERN stack: MongoDB, Express, React, Node</p>
					<p>Learn more about the project: Github link </p>
				</Container>
			</Fragment>
		);
	}
}
