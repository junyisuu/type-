import React, { PureComponent } from 'react';
import { Container, Button, Grid } from 'semantic-ui-react';
import './RaceSummary.css';

export class RaceSummary extends PureComponent {
	render() {
		const { accuracy, wpm, currentCount, incorrectArray } = this.props;

		return (
			<Container className='race_summary'>
				<h3>Race Complete!</h3>
				<Grid columns='equal' divided>
					<Grid.Row>
						<Grid.Column width={6}>
							<h3>
								Excerpt from: <a>STORY TITLE</a>
							</h3>
							<p>By: AUTHOR</p>
						</Grid.Column>
						<Grid.Column width={3}>
							<p>WPM: {wpm}</p>
							<p>Accuracy: {accuracy}</p>
						</Grid.Column>
						<Grid.Column width={3}>
							<p>Time: {currentCount}</p>
							<p>Typos: {incorrectArray.length}</p>
						</Grid.Column>
						<Grid.Column textAlign={'center'} width={4}>
							<Button>Next Race</Button>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Container>
		);
	}
}
