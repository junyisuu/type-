import React, { PureComponent } from 'react';
// import { findDOMNode } from 'react-dom';
import './Screen.css';
import classNames from 'classnames';

export class Screen extends PureComponent {
	render() {
		const {
			screenFade,
			inputSelected,
			completedText,
			inputText,
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
			<div className={screenClass}>
				<div className={screenInnerClass} ref='screenRef'>
					<div className=''>
						<span className='completedText'>{completedText}</span>
						<span className='progressMarker' ref='progRef'></span>
						<span ref='progressMarker' className='remainingText'>
							{remainingText}
						</span>
					</div>
				</div>
			</div>
		);
	}
}
