import React, { useState } from 'react';
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
	const alphabets = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
	const wordToDiscover = 'pneumonoultramicroscopicsilicovolcanoconiosis'.toUpperCase().split('');
	const wordInitialState = wordToDiscover.map((letter) => {
		return {
			letter: letter,
			hidden: true
		};
	});
	const [ wordState, setWordState ] = useState(wordInitialState);

	const alphabetsInitialState = alphabets.map((letter) => {
		return {
			letter: letter,
			disabled: false
		};
	});
	const [ alphabetsState, setAlphabetsState ] = useState(alphabetsInitialState);

	// rgb color counter for color gradients
	// start by -2 to make it start at 0 since the counter step is by 2
	let cnt = -2;

	// Number of tries allowed
	const nbrTries = Math.floor(wordToDiscover.length / 2);

	function handleBtnClick(letter) {
		// Show the letter founded
		const newWordState = wordState.map((row) => {
			if (letter === row.letter) {
				row.hidden = false;
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

		setAlphabetsState(newAlphabetsState);
		setWordState(newWordState);
	}

	return (
		<React.Fragment>
			<div className={classes.gameInfoContainer}>
				<Typography>{`You have ${nbrTries} numbers of attempts`}</Typography>
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
								width: `${100 / wordToDiscover.length}%`
							}}
							key={index}
						>
							{row.hidden ? '_' : row.letter}
						</div>
					);
				})}
			</div>
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
		</React.Fragment>
	);
}

export default Game;
