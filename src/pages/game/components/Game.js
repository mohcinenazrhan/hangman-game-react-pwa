import React, { useState, useEffect, useReducer } from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import progressDraw from '../../../assets/progress-draw.png';
import PropTypes from 'prop-types';
import SessionStats from './SessionStats';
import db from '../../../LocalDb';

const useStyles = makeStyles((theme) => ({
	button: {
		margin: theme.spacing(0.5),
		padding: 0,
		fontWeight: 'bold',
		[theme.breakpoints.up('sm')]: {
			margin: theme.spacing(1),
			padding: '6px 16px'
		}
	},
	gameInfoContainer: {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3)
	},
	wordContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'center',
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3)
	},
	wordLettres: {
		height: 60,
		maxWidth: 60,
		minWidth: 30,
		lineHeight: '60px',
		fontSize: 18,
		color: '#000',
		textAlign: 'center',
		marginBottom: 5
	},
	notFoundedLetters: {
		color: '#bc000f'
	},
	drawImgProgress: {
		background: `url(${progressDraw})`,
		width: 208,
		height: 130,
		margin: '0 auto',
		transition: theme.transitions.create('background', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	hide: {
		display: 'none'
	}
}));

function gameReducer(state, action) {
	switch (action.type) {
		case 'newGame': {
			return {
				...state,
				gameState: 'playing',
				nbrTriesState: 0,
				alphabetsState: [],
				wordState: [],
				gameNbr: state.gameNbr + 1,
				drawProgress: 0,
				helpBtnState: false
			};
		}
		case 'prepareGame': {
			return {
				...state,
				...action.newState
			};
		}
		case 'gameEnded': {
			return {
				...state,
				...action.newState
			};
		}
		case 'saveGame': {
			return {
				...state,
				stats: [ ...state.stats, JSON.stringify(action.newStats) ]
			};
		}
		case 'sessionEnded': {
			return {
				...state,
				isSessionEnd: true
			};
		}
		case 'guessResult': {
			return {
				...state,
				...action.newState
			};
		}
		case 'getHelp': {
			return {
				...state,
				...action.newState
			};
		}
		case 'disableHelp': {
			return {
				...state,
				helpBtnState: true
			};
		}
		default:
			return state;
	}
}

function Game({ id, words, alphabets, points, difficulty, updateUserPoints, prepareNewSession }) {
	const classes = useStyles();
	// rgb color counter for color gradients
	// start by -1 to make it start at 0 since the counter step is by 1
	let cnt = -1;
	// Draw progress game
	const progressDrawStartStep = 0;
	const progressDrawFinalStep = 6;

	const initialState = {
		wordState: [],
		alphabetsState: [],
		nbrTriesState: 0,
		nbrTries: 0,
		gameState: 'playing',
		gameNbr: 1,
		drawProgressState: progressDrawStartStep,
		score: 0,
		totalScore: points,
		sessionScore: 0,
		isSessionEnd: false,
		stats: [],
		helpBtnState: false
	};

	const [ state, dispatch ] = useReducer(gameReducer, initialState);
	const {
		wordState,
		alphabetsState,
		nbrTriesState,
		nbrTries,
		gameState,
		gameNbr,
		drawProgressState,
		score,
		totalScore,
		sessionScore,
		isSessionEnd,
		stats,
		helpBtnState
	} = state;

	/**
	 * useState(s)
	 */
	// const [ wordState, setWordState ] = useState([]);
	// const [ alphabetsState, setAlphabetsState ] = useState([]);
	// const [ nbrTriesState, setNbrTriesState ] = useState(0);
	// // Store given number tries
	// const [ nbrTries, setNbrTries ] = useState(0);
	// // Game current state
	// const [ gameState, setGameState ] = useState('playing');
	// // Game number state
	// const [ gameNbr, setGameNbr ] = useState(1);
	// // Draw progress state
	// const [ drawProgressState, setDrawProgress ] = useState(progressDrawStartStep);
	// // Score state
	// const [ score, setScore ] = useState(0);
	// // Total score state
	// const [ totalScore, setTotalScore ] = useState(points);
	// // Session score state
	// const [ sessionScore, setSessionScore ] = useState(0);
	// Help btn state
	// const [ helpBtnState, setHelpBtnState ] = useState(false);
	// // Session state
	// const [ isSessionEnd, setIsSessionEnd ] = useState(false);
	// Show state
	const [ show, setShow ] = useState('game');
	// // Session stats
	// const [ stats, setStats ] = useState([]);

	// Similar to componentDidMount and componentDidUpdate:
	useEffect(
		() => {
			// Check if all the wolds are used
			if (isSessionEnd) {
				console.log('The words end');
				return;
			}

			/* The logic that has to run once a game */

			const wordToDiscover = words[gameNbr - 1];
			const wordToDiscoverArray = wordToDiscover.toUpperCase().split('');
			const wordInitialState = wordToDiscoverArray.map((letter) => {
				return {
					letter: letter,
					state: 'hidden'
				};
			});
			const alphabetsInitialState = alphabets.map((letter) => {
				return {
					letter: letter,
					disabled: false
				};
			});

			// Default values for easy level
			let initScore = wordToDiscoverArray.length; // Initial score is the length of the word to discover
			let initTriesRatio = 1; // Number to use to devide on to get nbrTriesInitialState
			// Level of difficulty
			if (difficulty === 'Medium') {
				initScore = wordToDiscoverArray.length * 2;
				initTriesRatio = 2;
			} else if (difficulty === 'Hard') {
				initScore = wordToDiscoverArray.length * 3;
				initTriesRatio = 3;
			}

			// Number of tries allowed
			// Dinstact the letters to count the number of tries allowed
			const dinstactLetters = wordToDiscoverArray.filter((item, i, ar) => ar.indexOf(item) === i);
			const nbrTriesInitialState = Math.floor(dinstactLetters.length / initTriesRatio);

			dispatch({
				type: 'prepareGame',
				newState: {
					wordState: wordInitialState,
					alphabetsState: alphabetsInitialState,
					nbrTriesState: nbrTriesInitialState,
					nbrTries: nbrTriesInitialState,
					score: initScore
				}
			});
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ gameNbr ]
	);

	function handleBtnClick(letter) {
		// Helper variables
		let correctLetter = false,
			newNbrTriesState = nbrTriesState,
			newDrawProgressState = drawProgressState,
			newScore = score,
			isGameEnd = false,
			gameState = 'playing',
			localDbActions = [];

		// Show the letter founded
		let newWordState = wordState.map((row) => {
			if (letter === row.letter) {
				row.state = 'found';
				correctLetter = true;
			}
			return row;
		});

		// Disable the clicked button
		const newAlphabetsState = alphabetsState.map((row) => {
			if (letter === row.letter) {
				row.disabled = true;
			}
			return row;
		});

		if (!correctLetter) {
			newNbrTriesState = nbrTriesState - 1;
			// Progress the draw if not the game failed yet
			if (drawProgressState + 1 < progressDrawFinalStep) newDrawProgressState = drawProgressState + 1;
			// Remove one point from the score
			newScore = score > 1 ? score - 1 : score;
		}

		// Check if the user is failed, if the number of wrong tries allowed is end
		if (newNbrTriesState < 0) {
			isGameEnd = true;
			console.log('Unfortunately, you failed');
			gameState = 'failed';
			newDrawProgressState = progressDrawFinalStep;
			newWordState = showHiddenLetters(newWordState);
			// reset to 0
			newNbrTriesState = 0;
			newScore = 0;
		} else {
			// Check if the user is successfully found the word
			const lettersFoundedLen = newWordState.filter((row) => row.state === 'found').length;
			if (newWordState.length === lettersFoundedLen) {
				isGameEnd = true;
				console.log('Completed with success');
				gameState = 'succeed';
			}
		}

		disableHelpBtnFor(newWordState, newScore);

		dispatch({
			type: 'guessResult',
			newState: {
				score: newScore,
				nbrTriesState: newNbrTriesState,
				alphabetsState: newAlphabetsState,
				wordState: newWordState,
				drawProgressState: newDrawProgressState
			}
		});

		if (isGameEnd) {
			// if this current word is the last one
			if (words.length === gameNbr) {
				dispatch({ type: 'sessionEnded' });
				localDbActions.push({
					action: 'updateSessionData', data: {
						score: sessionScore + newScore,
						ended: true}}
				);
			}

			dispatch({
				type: 'gameEnded',
				newState: {
					totalScore: newScore + totalScore,
					sessionScore: sessionScore + newScore,
					gameState: gameState
				}
			});

			updateUserPoints(newScore + totalScore);
			const wordStats = {
				word: words[gameNbr - 1],
				result: gameState,
				wordState: newWordState,
				score: newScore,
				wrongGuessAllowed: nbrTries,
				misses: nbrTries - newNbrTriesState
			}

			dispatch({
				type: 'saveGame',
				newStats: wordStats
			});

			localDbActions.push({action: 'addWordData', data: wordStats});
			updateLocalDb(localDbActions);
		}
	}

	function updateLocalDb(localDbActions) {
		try {
				const sessionsTable = db.table('sessions');

				sessionsTable.get(id, (object) => {
					let newObject = object;

					for (let obj of localDbActions) {
						if (obj.action === 'addWordData') {
							newObject = Object.assign({}, newObject, { playedWords: [ ...object.playedWords, obj.data ] });
						} else if (obj.action === 'updateSessionData') {
							newObject = Object.assign({}, newObject, obj.data);
						}
					}

					sessionsTable.update(id, newObject).then((updated) => {
						if (updated) console.log('Updated');
						else console.log('Nothing was updated');
					});

				});
		} catch (error) {
			console.log(error.message);
		}
	}

	function showHiddenLetters(wordState) {
		return wordState.map((row) => {
			if (row.state === 'hidden') {
				row.state = 'show';
			}
			return row;
		});
	}

	function getProgressDraw() {
		return {
			backgroundPosition: `${drawProgressState * -200}px`
		};
	}

	function newGame() {
		dispatch({ type: 'newGame' });
	}

	function handleHelpClick() {
		const hiddenLetters = wordState.filter((row) => row.state === 'hidden');
		const randLetter = hiddenLetters[Math.floor(Math.random() * hiddenLetters.length)];

		const newWordState = wordState.map((row) => {
			if (row === randLetter) row.state = 'found';
			return row;
		});

		const newScore = score > 1 ? score - 1 : score;

		disableHelpBtnFor(newWordState, newScore);

		dispatch({
			type: 'getHelp',
			newState: {
				score: newScore,
				wordState: newWordState
			}
		});
	}

	function disableHelpBtnFor(WordState, Score) {
		// Disable help btn if only one letter remains or the score is 1
		const lettersHiddenLen = WordState.filter((row) => row.state === 'hidden').length;
		if (lettersHiddenLen === 1 || Score === 1) {
			dispatch({ type: 'disableHelp' });
		}
	}

	function newSession() {
		prepareNewSession();
	}

	function sessionstats() {
		setShow('stats');
	}

	function cancelSession() {
		prepareNewSession();
	}

	return (
		<React.Fragment>
			<div>
				<Typography>Your total score: {totalScore}</Typography>
				<Typography>Session difficulty: {difficulty}</Typography>
				<Typography>Your session score: {sessionScore}</Typography>
				<Typography>
					{gameNbr}/{words.length} words
				</Typography>
			</div>
			<div className={classes.gameInfoContainer}>
				{gameState === 'playing' && (
					<React.Fragment>
						<Button
							variant="contained"
							disabled={helpBtnState}
							className={classes.button}
							onClick={handleHelpClick}
						>
							Get Help = -1 point
						</Button>
						<Typography>{`${score} points to win`}</Typography>
						<Typography>{`You have ${nbrTriesState} attempts (wrong)`}</Typography>
					</React.Fragment>
				)}
			</div>
			{show === 'game' && (
				<React.Fragment>
					<div className={classes.drawImgProgress} style={getProgressDraw()} />
					<div className={classes.wordContainer}>
						{wordState.map((row, index) => {
							cnt += 1;
							return (
								<div
									className={clsx(
										classes.wordLettres,
										row.state === 'show' && classes.notFoundedLetters
									)}
									style={{
										backgroundColor: `rgb(${224 - cnt}, ${224 - cnt}, ${224 - cnt})`,
										width: `${100 / wordState.length}%`
									}}
									key={index}
								>
									{row.state === 'hidden' ? '_' : row.letter}
								</div>
							);
						})}
					</div>
					{gameState === 'playing' && (
						<div>
							{alphabetsState.map((row, index) => {
								return (
									<Button
										key={index}
										variant="contained"
										color="secondary"
										className={classes.button}
										disabled={row.disabled}
										onClick={() => handleBtnClick(row.letter)}
									>
										{row.letter}
									</Button>
								);
							})}
						</div>
					)}
					<div>
						{gameState !== 'playing' && (
							<React.Fragment>
								<Typography>
									{gameState === 'success' ? (
										`Great, you've found the word successfully, you win ${score} points, with ${nbrTries -
											nbrTriesState}/${nbrTries} wrong attempts`
									) : (
										`Unfortunately, you lose, the word was: ${words[
											gameNbr - 1
										]}, you had ${score} points, with ${nbrTries - nbrTriesState} wrong attempts`
									)}
								</Typography>
								{!isSessionEnd && (
									<Button
										variant="contained"
										color="primary"
										className={classes.button}
										onClick={newGame}
									>
										NEXT WORD
									</Button>
								)}
							</React.Fragment>
						)}
						{!isSessionEnd && (
							<Button
								variant="contained"
								color="primary"
								className={classes.button}
								onClick={cancelSession}
							>
								Cancel
							</Button>
						)}
						{isSessionEnd && (
							<React.Fragment>
								<Typography>The session is end</Typography>
								<Button
									variant="contained"
									color="primary"
									className={classes.button}
									onClick={sessionstats}
								>
									Show my session stats
								</Button>
								<Button
									variant="contained"
									color="primary"
									className={classes.button}
									onClick={newSession}
								>
									Go for another session
								</Button>
							</React.Fragment>
						)}
					</div>
				</React.Fragment>
			)}
			{show === 'stats' && (
				<React.Fragment>
					<Typography>My session stats</Typography>
					<SessionStats stats={stats} />
					<Button variant="contained" color="primary" className={classes.button} onClick={newSession}>
						Go for another session
					</Button>
				</React.Fragment>
			)}
		</React.Fragment>
	);
}

export default Game;

Game.propTypes = {
	id: PropTypes.number.isRequired,
	words: PropTypes.array.isRequired,
	alphabets: PropTypes.array.isRequired,
	points: PropTypes.number.isRequired,
	difficulty: PropTypes.string.isRequired,
	prepareNewSession: PropTypes.func.isRequired,
	updateUserPoints: PropTypes.func.isRequired
};
