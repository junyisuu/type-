import React, { PureComponent } from 'react';
import { Progress, Container, Grid, GridColumn } from 'semantic-ui-react';
import './RaceProgress.css';

export class RaceProgress extends PureComponent {
	render() {
		const { percentComplete, selfUser, players } = this.props;

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
					{Object.keys(players).map((player) => (
						<Grid.Row>
							<Grid.Column width={1}>
								<div className='progress_text'>
									<b>{player.user}</b>
								</div>
							</Grid.Column>
							<GridColumn width={15}>
								<Progress
									percent={player.percentComplete}
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
