import React, { PureComponent, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Grid, Image, Header } from 'semantic-ui-react';
// import './About.css';

export default class About extends PureComponent {
	render() {
		const { selfUser } = this.props;

		return (
			<Fragment>
				<h1>How to Play</h1>
				<Container>
					<Grid>
						<Grid.Row>
							<Grid.Column width={6}>1. Create an account</Grid.Column>
							<Grid.Column width={10}>Insert Picture</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column width={6}>
								2. Create a room or join an existing one
							</Grid.Column>
							<Grid.Column width={10}>Insert Picture</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column width={6}>3. Get ready to race</Grid.Column>
							<Grid.Column width={10}>Insert Picture</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column width={6}>4. Type!</Grid.Column>
							<Grid.Column width={10}>Insert Picture</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column width={6}>
								5. View the race standings and statistics
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
