import React, { PureComponent } from 'react';
import { Button } from 'semantic-ui-react';
import { RaceProgress } from './components/RaceProgress';
import { Screen } from './components/Screen';

export default class Type extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			inputText: '',
			keyPressed: null,
			keyCode: null,
			progress: 0,
			incorrectArray: [],
			remainingText: '',
			completedText: '',
			accuracy: 100,
			incorrect: false,
			wordCount: 0,
			wpm: 0,
			currentCount: 0,
			timeIncreasing: false,
			correctLetter: '',
			correctLetterCase: '',
			inputSelected: null,
			showStats: false,
			keyboardScaler: '100%',
			incorrectWordsArray: [],
			incorrectWordCurrent: false,
			screenFade: true,
			caps: '',
			showMenu: false,
			percentComplete: 0,
		};

		// this.genFocus = this.genFocus.bind(this);
		// this.genBlur = this.genBlur.bind(this);
		this.displayText = this.displayText.bind(this);
		this.calculatePercentComplete = this.calculatePercentComplete.bind(this);
	}

	componentDidMount() {
		// listen for keyboard typing
		document.addEventListener('keydown', (e) => {
			this.handleKeyPress(e);
		});
		this.displayText();
	}

	displayText(inputType, fromResults = false) {
		let contentText = '';
		let nextText = false;

		if (inputType === 'nextText') {
			nextText = true;
			inputType = this.state.inputSelected;
		}

		contentText =
			'Those around her do the same. “I will be watching you,” she warns. “Should anything happen to the king while you are sworn in his service—”With two hands, Xin Zhao clasps the flat sides of her blade. “Take this as my oath to you. ”';

		while (nextText === true && contentText === this.state.inputText) {
			contentText = 'This was the next message in line';
			nextText = false;
		}

		this.setState({
			inputText: contentText,
			remainingText: contentText,
			completedText: '',
			progress: 0,
			incorrectArray: [],
			accuracy: 100,
			incorrect: false,
			currentCount: 0,
			wordCount: 0,
			wpm: 0,
			timeIncreasing: false,
			correctLetter: contentText.charAt(0).toLowerCase(),
			correctLetterCase:
				contentText.charAt(0) === contentText.charAt(0).toUpperCase()
					? 'uppercase'
					: 'lowercase',
			inputSelected: inputType,
			showStats: false,
			incorrectWordsArray: [],
			incorrectWordCurrent: false,
			screenFade: false,
			showMenu: false,
		});
		clearInterval(this.intervalID);
		// setTimeout(() => this.refs.screen.setScrollPosition(), 0);

		let fadeTime = 1;
		// fromResults ? (fadeTime = 1000) : (fadeTime = 1);
		fadeTime = fromResults ? 1000 : 1;

		setTimeout(
			() =>
				this.setState({
					screenFade: true,
				}),
			fadeTime
		);
	}

	handleKeyPress(e) {
		if (
			e.key !== 'Tab' &&
			e.key !== 'CapsLock' &&
			e.key !== 'Shift' &&
			e.key !== 'Control' &&
			e.key !== 'Backspace' &&
			this.state.showStats === false
		) {
			const {
				inputText,
				progress,
				completedText,
				remainingText,
				incorrectArray,
				timeIncreasing,
			} = this.state;

			if (progress === 0 && timeIncreasing === false) {
				this.intervalID = setInterval(
					function () {
						const { currentCount, inputSelected } = this.state;

						this.setState({
							currentCount: currentCount + 1,
						});
					}.bind(this),
					1000
				);
				this.setState({
					timeIncreasing: true,
				});
			}

			let textLetter = inputText.charAt(progress);

			// Check for special unicode characters and standardize them
			if (textLetter === '“' || textLetter === '”') {
				textLetter = '"';
			}
			if (textLetter === '—') {
				textLetter = '-';
			}

			console.log('textletter', textLetter);

			this.setState({
				// if Shift then gets e.code which is either "ShiftLeft" or "ShiftRight"
				keyPressed: e.key === 'Shift' ? e.code : e.key,
				// keyCode: e.keyCode,
			});

			const { keyPressed } = this.state;

			if (keyPressed === textLetter) {
				this.setState({
					completedText: completedText + remainingText.charAt(0),
					remainingText: remainingText.slice(1),
					correctLetter: inputText.charAt(progress + 1).toLowerCase(),
					correctLetterCase:
						inputText.charAt(progress + 1) ===
						inputText.charAt(progress + 1).toUpperCase()
							? 'uppercase'
							: 'lowercase',
					progress: progress + 1,
					// accuracy is calculated as the percent of completed text out of the total number of characters typed (completed + incorrect)
					accuracy: String(
						(
							(this.state.completedText.length /
								(this.state.completedText.length +
									this.state.incorrectArray.length)) *
							100
						).toFixed(0)
					),
					incorrect: false,
				});

				// if the next character is a space
				if (inputText.charAt(progress + 1) === ' ') {
					this.handleWordEnd();
				}

				// if it's a space character
				// if (keyPressed == ' ') {
				// 	this.refs.screen.setScrollPosition();
				// }

				// if we're at the end of the excerpt
				if (
					this.state.remainingText === '' ||
					this.state.remainingText === ' '
				) {
					clearInterval(this.intervalID);
					this.handleWordEnd();
					this.setState({
						showStats: true,
					});
				}
			} else {
				// if user typed the incorrect character
				this.setState({
					// because it is incorrect, add it to the incorrectArray
					// concatenate incorrectArray with textLetter using spread syntax (...)
					incorrectArray: [...incorrectArray, textLetter],
					incorrect: true,
					incorrectWordCurrent: true,
				});
				this.setState({
					accuracy: String(
						(
							(this.state.completedText.length /
								(this.state.completedText.length +
									this.state.incorrectArray.length)) *
							100
						).toFixed(0)
					),
				});
			}
			let percentComplete = this.calculatePercentComplete();
			this.setState({
				percentComplete: percentComplete,
			});
		}
	}

	handleWordEnd() {
		// if (this.state.incorrectWordCurrent === true) {
		// 	let misspeltWord = this.state.completedText.split(" ").splice(-1)[0];
		// 	this.setState(prevState => ({

		// 	}))
		// }

		this.setState({
			wpm:
				this.state.currentCount > 0
					? (
							(this.state.wordCount + 1) /
							(this.state.currentCount / 60)
					  ).toFixed(0)
					: 0,
			wordCount: this.state.wordCount + 1,
			incorrectWordCurrent: false,
		});
	}

	calculatePercentComplete() {
		const { completedText, inputText } = this.state;
		let percentComplete = (
			(completedText.length / inputText.length) *
			100
		).toFixed(0);
		return percentComplete;
	}

	render() {
		const {
			accuracy,
			showStats,
			incorrectArray,
			wpm,
			currentCount,
			inputSelected,
			incorrectWordsArray,
			screenFade,
			completedText,
			inputText,
			remainingText,
			keyCode,
			incorrect,
			correctLetter,
			correctLetterCase,
			caps,
			keyboardScaler,
			showMenu,
			percentComplete,
		} = this.state;
		return (
			<div className='Type'>
				<div className='main'>
					<RaceProgress
						accuracy={accuracy}
						incorrectArray={incorrectArray}
						wpm={wpm}
						currentCount={currentCount}
						incorrectWordsArray={incorrectWordsArray}
						completedText={completedText}
						inputText={inputText}
						percentComplete={percentComplete}
					/>
					<Screen
						screenFade={screenFade}
						completedText={completedText}
						inputText={inputText}
						remainingText={remainingText}
						// ref='screen'
					/>
					{/* <Button onClick={this.displayText}>Start</Button> */}
				</div>
			</div>
		);
	}
}
