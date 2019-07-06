import React from 'react';
import { Button, makeStyles } from '@material-ui/core';
import progressDraw from './progress-draw.png';

const useStyles = makeStyles((theme) => ({
	button: {
		margin: theme.spacing(1),
		fontWeight: 'bold'
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
		border: '1px solid #fff',
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
	// rgb color counter for color gradients
	// start by -2 to make it start at 0 since the counter step is by 2
	let cnt = -2;
	return (
		<React.Fragment>
			<div className={classes.drawImgProgress} />
			<div className={classes.wordContainer}>
				{wordToDiscover.map((letter, index) => {
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
							{'_'}
						</div>
					);
				})}
			</div>
			<div>
				{alphabets.map((letter, index) => {
					return (
						<Button key={index} variant="contained" className={classes.button}>
							{letter}
						</Button>
					);
				})}
			</div>
		</React.Fragment>
	);
}

export default Game;
