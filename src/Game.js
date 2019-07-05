import React from 'react';
import { Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	button: {
		margin: theme.spacing(1)
	},
	input: {
		display: 'none'
	}
}));

function Game() {
	const classes = useStyles();
	const alphabets = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
	return (
		<div>
			{alphabets.map((letter, index) => {
				return (
					<Button key={index} variant="contained" className={classes.button}>
						{letter}
					</Button>
				);
			})}
		</div>
	);
}

export default Game;
