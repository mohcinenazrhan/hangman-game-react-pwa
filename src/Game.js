import React, { useState, useEffect } from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import progressDraw from './progress-draw.png';

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

function Game({ words, alphabets, points, updateUserPoints }) {
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

	// Similar to componentDidMount and componentDidUpdate:
	useEffect(
		() => {
			// Check if all the wolds are used
			if (wordsState.length === 0) {
				console.log('The words end');
				return;
			}

			// The logic that has to run once a game
			const wordToDiscover =
				wordsState.length > 1 ? wordsState[Math.floor(Math.random() * wordsState.length)] : wordsState[0];
			// Remove random word from words array to avoid choose it again
			const newWordsState =
				wordsState.length > 1 ? wordsState.filter((value) => value !== wordToDiscover) : wordToDiscover;
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
			// Number of tries allowed
			// Dinstact the letters to count the number of tries allowed
			const dinstactLetters = wordToDiscoverArray.filter((item, i, ar) => ar.indexOf(item) === i);
			const nbrTriesInitialState = Math.floor(dinstactLetters.length / 2);

			setWordsState(newWordsState);
			setCurrentWord(wordToDiscover);
			setWordState(wordInitialState);
			setAlphabetsState(alphabetsInitialState);
			setNbrTriesState(nbrTriesInitialState);
			setNbrTries(nbrTriesInitialState);
			// Initial score is the length of the word to discover
			setScore(wordToDiscoverArray.length);
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
		} else {
			// Check if the user is successfully found the word
			const lettersFoundedLen = newWordState.filter((row) => row.state === 'found').length;
			if (newWordState.length === lettersFoundedLen) {
				console.log('Completed with success');
				updateScoreState(newScore);
				setGameState('success');
			}
		}

		setScore(newScore);
		setNbrTriesState(newNbrTriesState);
		setAlphabetsState(newAlphabetsState);
		setWordState(newWordState);
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

	return (
		<React.Fragment>
			<div>
				<Typography>Your total score: {totalScore}</Typography>
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
						<Typography>{`You will gain ${score} points`}</Typography>
						<Typography>{`You have ${nbrTriesState} attempts (wrong)`}</Typography>
					</React.Fragment>
				)}
			</div>
			<div
				className={clsx(classes.drawImgProgress, wordsState.length === 0 && classes.hide)}
				style={getProgressDraw()}
			/>
			<div className={clsx(classes.wordContainer, wordsState.length === 0 && classes.hide)}>
				{wordState.map((row, index) => {
					cnt += 1;
					return (
						<div
							className={clsx(classes.wordLettres, row.state === 'show' && classes.notFoundedLetters)}
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
			{gameState === 'playing' ? (
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
			) : (
				<div>
					{wordsState.length === 0 ? (
						'Session end'
					) : (
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
							<Button variant="contained" color="primary" className={classes.button} onClick={newGame}>
								NEXT WORD
							</Button>
						</React.Fragment>
					)}
				</div>
			)}
		</React.Fragment>
	);
}

export default Game;
