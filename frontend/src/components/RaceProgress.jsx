import React, { PureComponent } from 'react';
import { Progress } from 'semantic-ui-react';

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
		} = this.props;
		return (
			<div>
				{/* link to total progress */}
				<Progress percent={percentComplete} indicating />
			</div>
		);
	}
}
