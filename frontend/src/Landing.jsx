import React, { PureComponent, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Grid, Image } from 'semantic-ui-react';
import './Landing.css';

export default class Landing extends PureComponent {
	render() {
		return (
			<Fragment>
				<Container className='landing_element'>
					<h1>Competitive Typing</h1>
					<p>Race against your friends. Thousands of excerpts. Play today!</p>
					<Button as={Link} to='/register'>
						Sign Up
					</Button>
				</Container>
				<Container className='landing_steps'>
					<Grid>
						<Grid.Row>
							<Grid.Column width={6}>
								1. Create an account. Stats can be viewed on profile page
							</Grid.Column>
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
							<Grid.Column width={6}>4. Type as fast as you can</Grid.Column>
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
			</Fragment>
		);
	}
}
