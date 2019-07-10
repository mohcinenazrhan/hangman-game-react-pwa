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
	}
}));

function Game({ words, alphabets }) {
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
	const [ wordState, setWordState ] = useState([]);
	const [ alphabetsState, setAlphabetsState ] = useState([]);
	const [ nbrTriesState, setNbrTriesState ] = useState(0);
	// Game current state
	const [ gameState, setGameState ] = useState('playing');
	// Current word state
	const [ currentWord, setCurrentWord ] = useState('');
	// Game number state
	const [ gameNbr, setGameNbr ] = useState(1);
	// Draw progress state
	const [ drawProgressState, setDrawProgress ] = useState(progressDrawStartStep);

	// Similar to componentDidMount and componentDidUpdate:
	useEffect(
		() => {
			if (words.length === 0 || alphabets.length === 0) return;

			// The logic that has to run once a game
			const wordToDiscover = words[Math.floor(Math.random() * words.length)];
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

			setCurrentWord(wordToDiscover);
			setWordState(wordInitialState);
			setAlphabetsState(alphabetsInitialState);
			setNbrTriesState(nbrTriesInitialState);
		},
		[ gameNbr, words, alphabets ]
	);

	function handleBtnClick(letter) {
		// Helper variables
		let correctLetter = false,
			newNbrTriesState = nbrTriesState;

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
		}

		// Check if the user is failed, if the number of wrong tries allowed is end
		if (newNbrTriesState < 0) {
			// reset to 0
			newNbrTriesState = 0;
			console.log('Unfortunately, you failed');
			setGameState('failed');
			setDrawProgress(progressDrawFinalStep);
			newWordState = showWrongLetters(newWordState);
		} else {
			// Check if the user is successfully found the word
			const lettersFoundedLen = newWordState.filter((row) => row.hidden === false).length;
			if (newWordState.length === lettersFoundedLen) {
				console.log('Completed with success');
				setGameState('success');
			}
		}

		setNbrTriesState(newNbrTriesState);
		setAlphabetsState(newAlphabetsState);
		setWordState(newWordState);
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
	}

	return (
		<React.Fragment>
			<div className={classes.gameInfoContainer}>
				<Typography>{`You have ${nbrTriesState} attempts (wrong)`}</Typography>
			</div>
			<div className={classes.drawImgProgress} style={getProgressDraw()} />
			<div className={classes.wordContainer}>
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
					<Typography>
						{gameState === 'success' ? (
							"Great, you've found the word successfully"
						) : (
							`Unfortunately, you failed, the word was: ${currentWord}`
						)}
					</Typography>
					<Button variant="contained" color="primary" className={classes.button} onClick={newGame}>
						REPLAY
					</Button>
				</div>
			)}
		</React.Fragment>
	);
}

export default Game;
