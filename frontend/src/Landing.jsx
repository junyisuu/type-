import React, { PureComponent, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Container, Button } from 'semantic-ui-react';
import './Landing.css';

export default class Landing extends PureComponent {
	render() {
		const { selfUser } = this.props;

		return (
			<Fragment>
				<div class='landing_background'></div>
				<Container className='landing_element'>
					<h1 className='landing_text landing_heading'>Typing Made Fun</h1>
					<p className='landing_text landing_subheading'>
						Race against your friends. Thousands of excerpts to type. Play
						today!
					</p>
					{selfUser ? (
						<Button className='orange_button' size='large' as={Link} to='/play'>
							Play
						</Button>
					) : (
						<Button
							className='orange_button'
							size='large'
							as={Link}
							to='/register'
						>
							Sign Up
						</Button>
					)}
				</Container>
			</Fragment>
		);
	}
}
