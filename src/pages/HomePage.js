import React, { useState, useEffect } from 'react';
import { Typography, Button, Paper, LinearProgress } from '@material-ui/core';
import { makeStyles, withStyles, lighten } from '@material-ui/core/styles';
import LocalDb from '../utils/LocalDb';

const useStyles = makeStyles((theme) => ({
	paper: {
		padding: theme.spacing(0.5, 1),
		marginBottom: theme.spacing(1.5),
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
		width: '100%'
	},
	progressInfo: {
		display: 'flex',
		flexWrap: 'nowrap',
		justifyContent: 'space-between'
	},
	link: {
		margin: theme.spacing(1)
	},
	button: {
		fontWeight: 'bold'
	},
	marginTopBottom: {
		margin: theme.spacing(2, 0)
	}
}));

const BorderLinearProgress = withStyles({
	root: {
		height: 5,
		backgroundColor: lighten('#4CAF50', 0.5),
		width: '100%',
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
	const [ nbrCompletedSessions, setNbrCompletedSessions ] = useState(0);
	const [ nbrWordGuessedSuccessfully, setNbrWordGuessedSuccessfully ] = useState(0);

	useEffect(() => {
		LocalDb.getLastUncompletedSessions(2)
			.then((rows) => {
				setUncompletedSessions(rows);
			})
			.catch((error) => {
				console.log('error: ' + error);
			});

		LocalDb.getNbrSessionsCompleted()
			.then((nbr) => {
				setNbrCompletedSessions(nbr);
			})
			.catch((error) => {
				console.log('error: ' + error);
			});

		LocalDb.getNbrWordGuessedSuccessfully()
			.then((nbr) => {
				setNbrWordGuessedSuccessfully(nbr);
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
			<Typography variant="h5" component="h1">
				Play and improve your English
			</Typography>
			<section className={classes.marginTopBottom}>
				<Typography variant="h6" component="h2">
					My statistics
				</Typography>
				<Paper>
					<Typography component="p">{`${nbrCompletedSessions} ${nbrCompletedSessions > 1
						? 'Sessions'
						: 'Session'} completed`}</Typography>
					<Typography component="p">{`${nbrWordGuessedSuccessfully} ${nbrWordGuessedSuccessfully > 1
						? 'Words'
						: 'Word'} guessed successfully`}</Typography>
				</Paper>
			</section>
			{uncompletedSessions.length > 0 && (
				<section className={classes.marginTopBottom}>
					<Typography variant="h6" component="h2">
						Pick up where you left off
					</Typography>
					{uncompletedSessions.map((session, index) => (
						<Paper key={index} className={classes.paper}>
							<div className={classes.paperInfoContainer}>
								<Typography variant="h6" component="h3">
									Session {session.id}
								</Typography>
								<Typography variant="body2">{`${session.language}, ${session.difficulty}`}</Typography>
								<Typography variant="body2">{`${session.playedWords.length}/${session.words
									.length} Completed, ${session.score} Points`}</Typography>
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
								<div className={classes.progressInfo}>
									<Typography variant="body2">
										{getWordsLeftInfo(session.words, session.playedWords)}
									</Typography>
									<Typography variant="body2">
										{`${Math.floor(session.playedWords.length * 100 / session.words.length)}%`}
									</Typography>
								</div>
								<BorderLinearProgress
									variant="determinate"
									color="secondary"
									value={session.playedWords.length * 100 / session.words.length}
								/>
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
