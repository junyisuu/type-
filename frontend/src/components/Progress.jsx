import React, { PureComponent } from 'react';
import { Progress } from 'semantic-ui-react';

export class Progress extends PureComponent {
	state = {
		percent: 10,
	};

	render() {
		const { wpm, currentCount, incorrectArray } = this.props;
		return (
			<div>
				{/* link to total progress */}
				<Progress percent={this.state.percent} indicating />
			</div>
		);
	}
}
