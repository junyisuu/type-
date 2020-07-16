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
			leaderboard,
		} = this.props;

		// https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript#:~:text=Use%20new%20Date()%20to,var%20mm%20%3D%20String(today.
		let today = new Date();
		let dd = String(today.getDate()).padStart(2, '0');
		let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		let yyyy = today.getFullYear();
		today = mm + '/' + dd + '/' + yyyy;

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
									<Button
										onClick={this.endRace}
										icon
										labelPosition='right'
										className='orange_button'
									>
										Back to Lobby
										<Icon name='home' />
									</Button>
								</Link>
							</Grid.Column>
						</Grid.Row>

						<Grid.Row className='race_ranking'>
							<Grid.Column width={8}>
								<h3>Lobby Leaderboard</h3>
								<Container>
									<Table celled collapsing>
										<Table.Header>
											<Table.Row>
												<Table.HeaderCell width={1}>Rank</Table.HeaderCell>
												<Table.HeaderCell width={2}>Player</Table.HeaderCell>
												<Table.HeaderCell width={1}>WPM</Table.HeaderCell>
												<Table.HeaderCell width={2}>Typos</Table.HeaderCell>
											</Table.Row>
										</Table.Header>
										<Table.Body>
											{Object.keys(lobby_users)
												.sort(
													(a, b) => lobby_users[a].rank - lobby_users[b].rank
												)
												.map((user) =>
													lobby_users[user].finished ? (
														lobby_users[user].username === selfUser.username ? (
															<Table.Row
																positive
																key={lobby_users[user].username}
															>
																<Table.Cell>
																	{lobby_users[user].rank}
																</Table.Cell>
																<Table.Cell>
																	{lobby_users[user].username}
																</Table.Cell>
																<Table.Cell>{lobby_users[user].wpm}</Table.Cell>
																<Table.Cell>
																	{lobby_users[user].incorrect_count}
																</Table.Cell>
															</Table.Row>
														) : (
															<Table.Row key={lobby_users[user].username}>
																<Table.Cell>
																	{lobby_users[user].rank}
																</Table.Cell>
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
							</Grid.Column>

							<Grid.Column width={8}>
								<h3>Excerpt Leaderboard</h3>
								<Container>
									<Table celled collapsing>
										<Table.Header>
											<Table.Row>
												<Table.HeaderCell width={1}>Rank</Table.HeaderCell>
												<Table.HeaderCell width={2}>Player</Table.HeaderCell>
												<Table.HeaderCell width={1}>WPM</Table.HeaderCell>
												<Table.HeaderCell width={2}>Typos</Table.HeaderCell>
												<Table.HeaderCell width={2}>Date</Table.HeaderCell>
											</Table.Row>
										</Table.Header>
										<Table.Body>
											{leaderboard.map((user, index) =>
												user[0] === selfUser.username &&
												user[1] === wpm &&
												user[2] === incorrectArray.length.toFixed(0) &&
												user[3] === today ? (
													<Table.Row positive key={'excerpt' + index}>
														<Table.Cell>{index + 1}</Table.Cell>
														<Table.Cell>{user[0]}</Table.Cell>
														<Table.Cell>{user[1]}</Table.Cell>
														<Table.Cell>{user[2]}</Table.Cell>
														<Table.Cell>{user[3]}</Table.Cell>
													</Table.Row>
												) : (
													<Table.Row key={'excerpt' + index}>
														<Table.Cell>{index + 1}</Table.Cell>
														<Table.Cell>{user[0]}</Table.Cell>
														<Table.Cell>{user[1]}</Table.Cell>
														<Table.Cell>{user[2]}</Table.Cell>
														<Table.Cell>{user[3]}</Table.Cell>
													</Table.Row>
												)
											)}
										</Table.Body>
									</Table>
								</Container>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Container>
			</>
		);
	}
}
