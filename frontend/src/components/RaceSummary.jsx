import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Grid, Icon, Table } from 'semantic-ui-react';
import './RaceSummary.css';

import socket from '../socketConfig';

export class RaceSummary extends PureComponent {
	constructor(props) {
		super(props);
		this.endRace = this.endRace.bind(this);
	}

	endRace() {
		const { room_id } = this.props;
		socket.emit('randomize_excerpt', room_id);
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
			lobby_users,
			selfUser,
		} = this.props;

		return (
			<>
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
						<Grid.Row className='race_ranking'>
							<Container>
								<Table celled collapsing>
									<Table.Header>
										<Table.Row>
											<Table.HeaderCell>Rank</Table.HeaderCell>
											<Table.HeaderCell>Player</Table.HeaderCell>
											<Table.HeaderCell>WPM</Table.HeaderCell>
											<Table.HeaderCell>Typos</Table.HeaderCell>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{Object.keys(lobby_users)
											.sort((a, b) => lobby_users[a].rank - lobby_users[b].rank)
											.map((user) =>
												lobby_users[user].finished ? (
													lobby_users[user].username === selfUser.username ? (
														<Table.Row positive>
															<Table.Cell>{lobby_users[user].rank}</Table.Cell>
															<Table.Cell>
																{lobby_users[user].username}
															</Table.Cell>
															<Table.Cell>{lobby_users[user].wpm}</Table.Cell>
															<Table.Cell>
																{lobby_users[user].incorrect_count}
															</Table.Cell>
														</Table.Row>
													) : (
														<Table.Row>
															<Table.Cell>{lobby_users[user].rank}</Table.Cell>
															<Table.Cell>
																{lobby_users[user].username}
															</Table.Cell>
															<Table.Cell>{lobby_users[user].wpm}</Table.Cell>
															<Table.Cell>
																{lobby_users[user].incorrect_count}
															</Table.Cell>
														</Table.Row>
													)
												) : null
											)}
									</Table.Body>
								</Table>
							</Container>
						</Grid.Row>
					</Grid>
				</Container>
			</>
		);
	}
}
