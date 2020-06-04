import React, { PureComponent } from 'react';
import './Screen.css';
import classNames from 'classnames';
import { Container } from 'semantic-ui-react';

export class Screen extends PureComponent {
	render() {
		const {
			screenFade,
			completedText,
			remainingText,
			incorrect,
			showStats,
		} = this.props;

		const screenInnerClass = classNames({
			screen__inner__wrapperFadeIn: screenFade && !incorrect && !showStats,
			screen__inner__wrapper: !screenFade,
			screen__inner__incorrect: incorrect,
			screen__inner__complete: showStats,
		});

		const screenClass = classNames({
			screen: true,
			screen__incorrect: incorrect,
			screen__complete: showStats,
		});

		return (
			<Container className={screenClass}>
				<div className={screenInnerClass}>
					<div className=''>
						<span className='completedText'>{completedText}</span>
						<span className='firstCharacter'>
							{remainingText.substring(0, 1)}
						</span>
						<span className='remainingText'>{remainingText.substring(1)}</span>
					</div>
				</div>
			</Container>
		);
	}
}
