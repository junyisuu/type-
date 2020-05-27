import React, { PureComponent } from 'react';
import { Progress, Container } from 'semantic-ui-react';
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
				{/* link to total progress */}
				<Progress percent={percentComplete} progress>
					<div className='progress_text'>{selfUser.username}</div>
				</Progress>
			</Container>
		);
	}
}
