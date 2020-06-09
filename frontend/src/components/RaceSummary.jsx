import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Grid, Icon } from 'semantic-ui-react';
import './RaceSummary.css';

import socket from '../socketConfig';

export class RaceSummary extends PureComponent {
	constructor(props) {
		super(props);
		this.endRace = this.endRace.bind(this);
	}

	endRace() {
		let room_id = window.sessionStorage.getItem('roomID');
		socket.emit('race_ended', room_id);
	}

	render() {
		const {
			title,
			author,
			url,
			accuracy,
			wpm,
			currentCount,
			incorrectArray,
		} = this.props;

		return (
			<Container className='race_summary'>
				<h3>Race Complete!</h3>
				<Grid columns='equal' divided>
					<Grid.Row>
						<Grid.Column width={6}>
							<h3>
								Excerpt from:{' '}
								<a style={{ textDecoration: 'underline' }} href={url}>
									{title}
								</a>
							</h3>
							{author ? <p>By: {author}</p> : null}
						</Grid.Column>
						<Grid.Column width={3}>
							<p>WPM: {wpm}</p>
							<p>Accuracy: {accuracy}%</p>
						</Grid.Column>
						<Grid.Column width={3}>
							<p>Time: {currentCount} seconds</p>
							<p>Typos: {incorrectArray.length}</p>
						</Grid.Column>
						<Grid.Column textAlign={'center'} width={4}>
							<Link
								to={{
									pathname: '/lobby',
								}}
							>
								<Button onClick={this.endRace} icon labelPosition='right'>
									Back to Lobby
									<Icon name='home' />
								</Button>
							</Link>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Container>
		);
	}
}
