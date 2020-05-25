import React, { PureComponent } from 'react';
// import { findDOMNode } from 'react-dom';
import './Screen.css';

export class Screen extends PureComponent {
	render() {
		const {
			screenFade,
			inputSelected,
			completedText,
			inputText,
			remainingText,
		} = this.props;
		return (
			<div className='screen'>
				<div
					className={
						screenFade === true
							? 'screen__inner__wrapperFadeIn'
							: 'screen__inner__wrapper'
					}
					ref='screenRef'
				>
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
