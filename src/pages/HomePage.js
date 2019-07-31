import React, { useState, useEffect } from 'react';
import { Typography, Button, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LocalDb from '../LocalDb';

const useStyles = makeStyles((theme) => ({
	paper: {
		padding: theme.spacing(1.5, 1),
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

	return (
		<React.Fragment>
			<Typography variant="h4" component="h1">
				Play and improve your English
			</Typography>
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
								<Typography component="p">
									{session.words.length - session.playedWords.length} Words left to guess
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
