import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { RaceProgress } from './components/RaceProgress';
import { Screen } from './components/Screen';
import { RaceSummary } from './components/RaceSummary';

import socket from './socketConfig';

// Reference: https://github.com/RodneyCumming/react-typing

export default class Type extends PureComponent {
	constructor(props) {
		super(props);

		let lobby_users = JSON.parse(window.sessionStorage.getItem('lobby_users'));
		let room_id = window.sessionStorage.getItem('roomID');

		this.state = {
			excerpt: '',
			author: '',
			title: '',
			url: '',
			excerpt_id: '',
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
			incorrectWordsArray: [],
			incorrectWordCurrent: false,
			screenFade: true,
			percentComplete: 0,
			redirectToPlay: false,
			lobby_users: lobby_users,
			room_id: room_id,
		};

		this.displayText = this.displayText.bind(this);
		this.calculatePercentComplete = this.calculatePercentComplete.bind(this);
		this.getExcerpt = this.getExcerpt.bind(this);
	}

	async getExcerpt() {
		return new Promise((resolve, reject) => {
			let room_id = window.sessionStorage.getItem('roomID');
			socket.emit('get_excerpt', room_id, function (received_excerpt) {
				if (received_excerpt) {
					resolve(received_excerpt);
				} else {
					reject('unable to get excerpt');
				}
			});
		});
	}

	async componentDidMount() {
		const parent = this;
		// listen for keyboard typing
		document.addEventListener('keydown', (e) => {
			this.handleKeyPress(e);
		});
		if (window.sessionStorage.getItem('roomID')) {
			// https://stackoverflow.com/questions/43638938/updating-an-object-with-setstate-in-react
			socket.on('progress_update', function (username, percentComplete) {
				parent.setState((prevState) => {
					let lobby_users = Object.assign({}, prevState.lobby_users);
					lobby_users[username]['percentComplete'] = percentComplete;
					return { lobby_users };
				});
			});

			socket.on('update_race_stats', function (
				username,
				wpm,
				rank,
				incorrect_count
			) {
				console.log('inside update');
				parent.setState((prevState) => {
					let lobby_users = Object.assign({}, prevState.lobby_users);
					lobby_users[username]['wpm'] = wpm;
					lobby_users[username]['finished'] = true;
					lobby_users[username]['rank'] = rank;
					lobby_users[username]['incorrect_count'] = incorrect_count;
					return { lobby_users };
				});
			});

			this.displayText();
		} else {
			// there isn't a stored room_id in session...
			this.setState({
				redirectToPlay: true,
			});
		}
	}

	async displayText(inputType, fromResults = false) {
		let contentText = '';
		let nextText = false;

		if (inputType === 'nextText') {
			nextText = true;
			inputType = this.state.inputSelected;
		}

		await this.getExcerpt().then(
			(excerpt) => {
				console.log('excerpt: ', excerpt);
				this.setState({
					excerpt: excerpt.excerpt,
					author: excerpt.author,
					title: excerpt.title,
					url: excerpt.url,
					excerpt_id: excerpt._id,
				});
			},
			(error) => {
				console.log(error);
			}
		);

		contentText = this.state.excerpt;
		// contentText = 'Test123';

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
						const { currentCount } = this.state;

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
			if (textLetter === '’') {
				textLetter = "'";
			}
			if (textLetter === '–') {
				textLetter = '-';
			}

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

			this.updateProgress();
		}
		if (e.key === 'Backspace') {
			e.preventDefault();
		}
		if (e.key === "'") {
			e.preventDefault();
		}
	}

	updateProgress() {
		const { selfUser } = this.props;
		const { percentComplete, excerpt_id, incorrectArray } = this.state;

		let room_id = window.sessionStorage.getItem('roomID');
		if (percentComplete !== 0) {
			socket.emit('keypress', room_id, selfUser.username, percentComplete);
		}

		let incorrect_count = incorrectArray.length.toFixed(0);

		// if the player has finished the race, send update to others
		if (this.state.showStats) {
			socket.emit(
				'finished_race',
				room_id,
				selfUser.username,
				this.state.wpm,
				excerpt_id,
				incorrect_count
			);
		}
	}

	handleWordEnd() {
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
			title,
			author,
			url,
			accuracy,
			showStats,
			incorrectArray,
			wpm,
			currentCount,
			screenFade,
			completedText,
			inputText,
			remainingText,
			incorrect,
			percentComplete,
			redirectToPlay,
			lobby_users,
			room_id,
		} = this.state;

		const { selfUser } = this.props;

		if (!selfUser) {
			return <Redirect to='/' />;
		}

		if (redirectToPlay) {
			return <Redirect to='/play' />;
		}

		return (
			<div className='Type'>
				<div className='main'>
					<RaceProgress
						percentComplete={percentComplete}
						selfUser={selfUser}
						lobby_users={lobby_users}
					/>
					<Screen
						screenFade={screenFade}
						completedText={completedText}
						inputText={inputText}
						remainingText={remainingText}
						incorrect={incorrect}
						showStats={showStats}
					/>
					{showStats ? (
						<RaceSummary
							title={title}
							author={author}
							url={url}
							accuracy={accuracy}
							wpm={wpm}
							currentCount={currentCount}
							incorrectArray={incorrectArray}
							room_id={room_id}
							lobby_users={lobby_users}
							selfUser={selfUser}
						/>
					) : null}
				</div>
			</div>
		);
	}
}
