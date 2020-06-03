import React, { PureComponent } from 'react';
import { Progress, Container, Grid, GridColumn } from 'semantic-ui-react';
import './RaceProgress.css';

export class RaceProgress extends PureComponent {
	state = {
		percent: 0,
	};

	render() {
		const {
			accuracy,
			incorrectArray,
			wpm,
			currentCount,
			incorrectWordsArray,
			percentComplete,
			selfUser,
		} = this.props;

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
				</Grid>
			</Container>
		);
	}
}
