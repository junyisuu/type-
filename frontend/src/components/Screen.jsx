import React, { PureComponent } from 'react';
// import { findDOMNode } from 'react-dom';
import './Screen.css';

export class Screen extends PureComponent {
	// setScrollPosition() {
	// 	const elementNode = findDOMNode(this.refs.progressMarker);
	// 	let containerNode = findDOMNode(this.refs.screenRef);

	// 	var topPost = elementNode.offsetTop;
	// 	containerNode.scrollTop = topPos - 140;
	// }

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
					<div className='progressMeter'>
						{((completedText.length / inputText.length) * 100).toFixed(0) + '%'}
					</div>
				</div>
			</div>
		);
	}
}
