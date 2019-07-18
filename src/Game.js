import React, { useState, useEffect } from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import progressDraw from './progress-draw.png';
import PropTypes from 'prop-types';

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

function Game({ words, alphabets, points, difficulty, updateUserPoints, prepareNewSession }) {
	const classes = useStyles();
	// rgb color counter for color gradients
	// start by -1 to make it start at 0 since the counter step is by 1
	let cnt = -1;
	// Draw progress game
	const progressDrawStartStep = 0;
	const progressDrawFinalStep = 6;

	/**
	 * useState(s)
	 */
	const [ wordsState, setWordsState ] = useState(words);
	const [ wordState, setWordState ] = useState([]);
	const [ alphabetsState, setAlphabetsState ] = useState([]);
	const [ nbrTriesState, setNbrTriesState ] = useState(0);
	// Store given number tries
	const [ nbrTries, setNbrTries ] = useState(0);
	// Game current state
	const [ gameState, setGameState ] = useState('playing');
	// Current word state
	const [ currentWord, setCurrentWord ] = useState('');
	// Game number state
	const [ gameNbr, setGameNbr ] = useState(1);
	// Draw progress state
	const [ drawProgressState, setDrawProgress ] = useState(progressDrawStartStep);
	// Score state
	const [ score, setScore ] = useState(0);
	// Total score state
	const [ totalScore, setTotalScore ] = useState(points);
	// Session score state
	const [ sessionScore, setSessionScore ] = useState(0);
	// Help btn state
	const [ helpBtnState, setHelpBtnState ] = useState(false);
	// Session state
	const [ isSessionEnd, setIsSessionEnd ] = useState(false);
	// Show state
	const [ show, setShow ] = useState('game');
	// Session states
	const [ states, setStates ] = useState([]);

	// Similar to componentDidMount and componentDidUpdate:
	useEffect(
		() => {
			// Check if all the wolds are used
			if (isSessionEnd) {
				console.log('The words end');
				return;
			}

			// The logic that has to run once a game
			const wordToDiscover = wordsState[Math.floor(Math.random() * wordsState.length)];
			// Remove random word from words array to avoid choose it again
			const newWordsState = wordsState.filter((value) => value !== wordToDiscover);
			console.log(wordsState, newWordsState);

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

			setWordsState(newWordsState);
			setCurrentWord(wordToDiscover);
			setWordState(wordInitialState);
			setAlphabetsState(alphabetsInitialState);
			setNbrTriesState(nbrTriesInitialState);
			setNbrTries(nbrTriesInitialState);
			setScore(initScore);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ gameNbr ]
	);

	function handleBtnClick(letter) {
		// Helper variables
		let correctLetter = false,
			newNbrTriesState = nbrTriesState,
			newScore = score;

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
			if (drawProgressState + 1 < progressDrawFinalStep) setDrawProgress(drawProgressState + 1);
			// Remove one point from the score
			newScore = score - 1;
		}

		// Disable help btn if only one letter remains
		const lettersHiddenLen = newWordState.filter((row) => row.state === 'hidden').length;
		if (lettersHiddenLen === 1) {
			setHelpBtnState(true);
		}

		// Check if the user is failed, if the number of wrong tries allowed is end
		if (newNbrTriesState < 0) {
			// reset to 0
			newNbrTriesState = 0;
			console.log('Unfortunately, you failed');
			setGameState('failed');
			setDrawProgress(progressDrawFinalStep);
			newWordState = showWrongLetters(newWordState);
			newScore = 0;
			updateScoreState(newScore);
			const gameState = {
				word: currentWord,
				wordState: newWordState,
				score: newScore,
				nbrTries: nbrTries - newNbrTriesState
			};
			saveGame(gameState);
			// if this current word is the last one
			if (wordsState.length === 0) setIsSessionEnd(true);
		} else {
			// Check if the user is successfully found the word
			const lettersFoundedLen = newWordState.filter((row) => row.state === 'found').length;
			if (newWordState.length === lettersFoundedLen) {
				console.log('Completed with success');
				updateScoreState(newScore);
				setGameState('success');
				const gameState = {
					word: currentWord,
					wordState: newWordState,
					score: newScore,
					nbrTries: nbrTries - newNbrTriesState
				};
				saveGame(gameState);
				// if this current word is the last one
				if (wordsState.length === 0) setIsSessionEnd(true);
			}
		}

		setScore(newScore);
		setNbrTriesState(newNbrTriesState);
		setAlphabetsState(newAlphabetsState);
		setWordState(newWordState);
	}

	function saveGame(gameState) {
		setStates((currentState) => [ ...currentState, JSON.stringify(gameState) ]);
	}

	function updateScoreState(newScore) {
		setTotalScore(newScore + totalScore);
		updateUserPoints(newScore + totalScore);
		setSessionScore((sessionScore) => sessionScore + newScore);
	}

	function showWrongLetters(wordState) {
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
		setGameState('playing');
		setNbrTriesState(0);
		setAlphabetsState([]);
		setWordState([]);
		setGameNbr(gameNbr + 1);
		setDrawProgress(progressDrawStartStep);
		setHelpBtnState(false);
	}

	function handleHelpClick() {
		const hiddenLetters = wordState.filter((row) => row.state === 'hidden');
		const randLetter = hiddenLetters[Math.floor(Math.random() * hiddenLetters.length)];

		const newWordState = wordState.map((row) => {
			if (row === randLetter) row.state = 'found';
			return row;
		});

		// Disable help btn if only one letter remains
		const lettersHiddenLen = newWordState.filter((row) => row.state === 'hidden').length;
		if (lettersHiddenLen === 1) {
			setHelpBtnState(true);
		}

		setScore(score - 1);
		setWordState(newWordState);
	}

	function newSession() {
		prepareNewSession();
	}

	function sessionStates() {
		setShow('states');
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
										`Unfortunately, you lose, the word was: ${currentWord}, you had ${score} points, with ${nbrTries -
											nbrTriesState} wrong attempts`
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
									onClick={sessionStates}
								>
									Show my session states
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
			{show === 'states' && (
				<React.Fragment>
					<Typography>My session states</Typography>
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
	words: PropTypes.array.isRequired,
	alphabets: PropTypes.array.isRequired,
	points: PropTypes.number.isRequired,
	difficulty: PropTypes.string.isRequired,
	prepareNewSession: PropTypes.func.isRequired,
	updateUserPoints: PropTypes.func.isRequired
};
