import React from 'react';
import { Typography, Button, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	link: {
		margin: theme.spacing(1)
	},
	button: {
		margin: theme.spacing(0.5),
		padding: 0,
		fontWeight: 'bold',
		[theme.breakpoints.up('sm')]: {
			margin: theme.spacing(1),
			padding: '6px 16px'
		}
	},
	marginTopBottom: {
		marginTop: theme.spacing(5),
		marginBottom: theme.spacing(5)
	}
}));

const HomePage = ({ goToPage }) => {
	const classes = useStyles();

	function handleOnClick() {
		goToPage('game');
	}

	return (
		<React.Fragment>
			<Typography variant="h4" component="h1">
				Hangman Game
			</Typography>
			<Typography variant="body1" gutterBottom className={classes.marginTopBottom}>
				Hangman is a paper and pencil guessing game for two or more players. One player thinks of a word, phrase
				or sentence and the other(s) tries to guess it by suggesting letters or numbers, within a certain number
				of guesses.
				<Link
					href="https://en.wikipedia.org/wiki/Hangman_(game)"
					target="_blank"
					rel="noreferrer"
					className={classes.link}
				>
					See more
				</Link>
			</Typography>
			<Button variant="contained" color="primary" className={classes.button} onClick={handleOnClick}>
				Start
			</Button>
		</React.Fragment>
	);
};

export default HomePage;
