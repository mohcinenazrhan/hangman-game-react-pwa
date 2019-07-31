import React, { useState, useEffect } from 'react';
import { Typography, Button, Paper, LinearProgress } from '@material-ui/core';
import { makeStyles, withStyles, lighten } from '@material-ui/core/styles';
import LocalDb from '../LocalDb';

const useStyles = makeStyles((theme) => ({
	paper: {
		padding: theme.spacing(0.5, 1),
		margin: theme.spacing(2, 0),
		background: '#FAFAFA',
		textAlign: 'left',
		display: 'flex',
		justifyContent: 'space-between',
		flexWrap: 'wrap'
	},
	paperInfoContainer: {},
	paperActionContainer: {
		alignSelf: 'center'
	},
	progressContainer: {
		display: 'flex',
		flexWrap: 'nowrap',
		justifyContent: 'space-around',
		alignItems: 'center',
		width: '100%'
	},
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

const BorderLinearProgress = withStyles({
	root: {
		height: 5,
		backgroundColor: lighten('#4CAF50', 0.5),
		width: '90%',
		borderRadius: 5
	},
	bar: {
		borderRadius: 5,
		backgroundColor: '#4CAF50'
	}
})(LinearProgress);

const HomePage = ({ goToPage, resumeSession }) => {
	const classes = useStyles();
	const [ uncompletedSessions, setUncompletedSessions ] = useState([]);

	useEffect(() => {
		LocalDb.getLastUncompletedSessions(5)
			.then((rows) => {
				setUncompletedSessions(rows);
			})
			.catch((error) => {
				console.log('error: ' + error);
			});
	}, []);

	function handleNewSessionClick() {
		goToPage('game');
	}

	function handleContinueClick(id) {
		resumeSession(id);
	}

	function getWordsLeftInfo(words, playedWords) {
		const nbrWordsLeft = words.length - playedWords.length;
		return `${nbrWordsLeft} ${nbrWordsLeft > 1 ? 'Words' : 'Word'} left to guess`;
	}

	return (
		<React.Fragment>
			<Typography variant="h4" component="h1">
				Play and improve your English
			</Typography>
			<section className={classes.marginTopBottom}>
				<Typography variant="h5" component="h2">
					My statistics
				</Typography>
				<Paper>
					<Typography component="p">{`10 Sessions completed`}</Typography>
					<Typography component="p">{`123 Words guessed successfully`}</Typography>
				</Paper>
			</section>
			{uncompletedSessions.length > 0 && (
				<section className={classes.marginTopBottom}>
					<Typography variant="h5" component="h2">
						Pick up where you left off
					</Typography>
					{uncompletedSessions.map((session, index) => (
						<Paper key={index} className={classes.paper}>
							<div className={classes.paperInfoContainer}>
								<Typography variant="h6" component="h3">
									Session {session.id}
								</Typography>
								<Typography component="p">{`${session.language}, ${session.difficulty}`}</Typography>
								<Typography component="p">{`${session.playedWords.length}/${session.words
									.length} Completed, ${session.score} Points`}</Typography>
								<Typography component="p">
									{getWordsLeftInfo(session.words, session.playedWords)}
								</Typography>
							</div>
							<div className={classes.paperActionContainer}>
								<Button
									variant="contained"
									color="primary"
									onClick={() => {
										handleContinueClick(session.id);
									}}
								>
									Continue
								</Button>
							</div>
							<div className={classes.progressContainer}>
								<BorderLinearProgress
									variant="determinate"
									color="secondary"
									value={session.playedWords.length * 100 / session.words.length}
								/>
								<Typography>
									{`${Math.floor(session.playedWords.length * 100 / session.words.length)}%`}
								</Typography>
							</div>
						</Paper>
					))}
				</section>
			)}
			<Button variant="contained" color="primary" className={classes.button} onClick={handleNewSessionClick}>
				New Session
			</Button>
		</React.Fragment>
	);
};

export default HomePage;
