import React, { useState, useEffect } from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
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
		color: '#FFFFFF',
		textAlign: 'center',
		marginBottom: 5
	},
	drawImgProgress: {
		background: `url(${progressDraw})`,
		width: 208,
		height: 130,
		margin: '0 auto'
	}
}));

function Game() {
	const classes = useStyles();
	// rgb color counter for color gradients
	// start by -2 to make it start at 0 since the counter step is by 2
	let cnt = -2;

	/**
	 * useState(s)
	 */
	const [ wordState, setWordState ] = useState([]);
	const [ alphabetsState, setAlphabetsState ] = useState([]);
	const [ nbrTriesState, setNbrTriesState ] = useState(0);
	// Game complet state
	const [ isCompletedState, setIsCompleted ] = useState(false);
	// Game failed state
	const [ isFailedState, setIsFailed ] = useState(false);

	// Similar to componentDidMount and componentDidUpdate:
	useEffect(
		() => {
			if (isCompletedState === true || isFailedState === true) return;
			// The logic that has to run once a game
			const alphabets = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
			const words = [
				'January',
				'April',
				'March',
				'Websites',
				'Devices',
				'How',
				'Mobile',
				'pneumonoultramicroscopicsilicovolcanoconiosis'
			];
			const wordToDiscover = words[Math.floor(Math.random() * words.length)].toUpperCase().split('');
			const wordInitialState = wordToDiscover.map((letter) => {
				return {
					letter: letter,
					hidden: true
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
			const dinstactLetters = wordToDiscover.filter((item, i, ar) => ar.indexOf(item) === i);
			const nbrTriesInitialState = Math.floor(dinstactLetters.length / 2);

			setWordState(wordInitialState);
			setAlphabetsState(alphabetsInitialState);
			setNbrTriesState(nbrTriesInitialState);
		},
		[ isCompletedState, isFailedState ]
	);

	function handleBtnClick(letter) {
		// Helper variables
		let correctLetter = false,
			newNbrTriesState = nbrTriesState;

		// Show the letter founded
		const newWordState = wordState.map((row) => {
			if (letter === row.letter) {
				row.hidden = false;
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

		if (!correctLetter) newNbrTriesState = nbrTriesState - 1;

		// Check if the user is failed, if the number of tries allowed is end
		if (newNbrTriesState === 0) {
			console.log('Unfortunately, you failed');
			setIsFailed(true);
		} else {
			// Check if the user is successfully found the word
			const lettersFoundedLen = newWordState.filter((row) => row.hidden === false).length;
			if (newWordState.length === lettersFoundedLen) {
				console.log('Completed with success');
				setIsCompleted(true);
			}
		}

		setNbrTriesState(newNbrTriesState);
		setAlphabetsState(newAlphabetsState);
		setWordState(newWordState);
	}

	function newGame() {
		setIsCompleted(false);
		setIsFailed(false);
		setNbrTriesState(0);
		setAlphabetsState([]);
		setWordState([]);
	}

	return (
		<React.Fragment>
			<div className={classes.gameInfoContainer}>
				<Typography>{`You have ${nbrTriesState} attempts (wrong)`}</Typography>
			</div>
			<div className={classes.drawImgProgress} />
			<div className={classes.wordContainer}>
				{wordState.map((row, index) => {
					cnt += 2;
					return (
						<div
							className={classes.wordLettres}
							style={{
								backgroundColor: `rgb(${55 - cnt}, ${71 - cnt}, ${79 - cnt})`,
								width: `${100 / wordState.length}%`
							}}
							key={index}
						>
							{row.hidden ? '_' : row.letter}
						</div>
					);
				})}
			</div>
			{isCompletedState || isFailedState ? (
				<div>
					<Typography>
						{isCompletedState ? (
							"Great, you've found the word successfully"
						) : (
							`Unfortunately, you failed, the expression was: ${wordState.join('')}`
						)}
					</Typography>
					<Button variant="contained" color="primary" className={classes.button} onClick={newGame}>
						REPLAY
					</Button>
				</div>
			) : (
				<div>
					{alphabetsState.map((row, index) => {
						return (
							<Button
								key={index}
								variant="contained"
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
		</React.Fragment>
	);
}

export default Game;
