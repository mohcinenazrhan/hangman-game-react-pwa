import React from 'react';
import { Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	button: {
		margin: theme.spacing(1)
	},
	wordContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'center',
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3)
	},
	lettreHide: {
		height: 60,
		width: '6%',
		maxWidth: 60,
		minWidth: 30,
		border: '1px solid #fff',
		lineHeight: '60px',
		fontSize: 18,
		color: '#FFFFFF',
		textAlign: 'center',
		background: '#37474F'
	}
}));

function Game() {
	const classes = useStyles();
	const alphabets = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
	const wordToDiscover = 'hilarious'.toUpperCase().split('');
	return (
		<React.Fragment>
			<div className={classes.wordContainer}>
				{wordToDiscover.map((letter, index) => (
					<div className={classes.lettreHide} key={index}>
						{'_'}
					</div>
				))}
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
