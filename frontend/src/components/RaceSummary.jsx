import React, { PureComponent, Fragment } from 'react';

export class RaceSummary extends PureComponent {
	render() {
		const { accuracy, wpm, currentCount, incorrectArray } = this.props;

		return (
			<Fragment>
				<p>Congrats, you finished!</p>
				<p>WPM: {wpm}</p>
				<p>Accuracy: {accuracy}</p>
				<p>Time: {currentCount}</p>
				<p>Typos: {incorrectArray.length}</p>
			</Fragment>
		);
	}
}
