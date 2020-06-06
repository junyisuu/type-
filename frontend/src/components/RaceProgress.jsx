import React, { PureComponent } from 'react';
import { Progress, Container, Grid, GridColumn } from 'semantic-ui-react';
import './RaceProgress.css';

export class RaceProgress extends PureComponent {
	render() {
		const { percentComplete, selfUser, lobby_users } = this.props;

		return (
			<Container className='race_progress'>
				<Grid>
					<Grid.Row>
						<Grid.Column width={1}>
							<div className='progress_text'>
								<b>{selfUser.username}</b>
							</div>
						</Grid.Column>
						<GridColumn width={15}>
							<Progress
								percent={percentComplete}
								progress
								size='small'
							></Progress>
						</GridColumn>
					</Grid.Row>
					{Object.keys(lobby_users)
						.filter((user) => lobby_users[user].username !== selfUser.username)
						.map((player) => (
							<Grid.Row>
								<Grid.Column width={1}>
									<div className='progress_text'>
										<b>{lobby_users[player].username}</b>
									</div>
								</Grid.Column>
								<GridColumn width={15}>
									<Progress
										percent={lobby_users[player].percentComplete}
										progress
										size='small'
									></Progress>
								</GridColumn>
							</Grid.Row>
						))}
				</Grid>
			</Container>
		);
	}
}
