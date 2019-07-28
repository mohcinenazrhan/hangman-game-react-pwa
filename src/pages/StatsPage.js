import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Divider, Button } from '@material-ui/core';
import db from '../LocalDb';
import SessionWordsStats from './common/SessionWordsStats';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%'
	},
	pageTitle: {
		marginBottom: theme.spacing(5)
	},
	paper: {
		marginTop: theme.spacing(3),
		width: '100%',
		overflowX: 'auto',
		marginBottom: theme.spacing(2)
	},
	tableCell: {
		padding: '5px'
	},
	tableCellNoPadding: {
		padding: '0px !important'
	},
	letterFound: {
		color: '#27ae60'
	},
	letterShow: {
		color: '#c0392b'
	},
	succeed: {
		borderLeft: '6px solid #2ecc71'
	},
	failed: {
		borderLeft: '6px solid #e74c3c'
	},
	statsContainer: {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3),
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
		textAlign: 'left'
	}
}));

const StatesPage = ({ resumeSession, goToPage }) => {
	const classes = useStyles();
	const [ stats, setStats ] = useState([]);

	useEffect(() => {
		db.table('sessions').orderBy('date').reverse().limit(5).toArray((rows) => setStats(rows)).catch((error) => {
			console.log('error: ' + error);
		});
	}, []);

	function handleResumeSession(id) {
		resumeSession(id);
	}

	function handleFirstSession() {
		goToPage('game');
	}

	return (
		<div className={classes.root}>
			<Typography variant="h5" component="h1" className={classes.pageTitle}>
				My sessions stats
			</Typography>
			{stats.length > 0 ? (
				stats.map((statsRow, index) => (
					<React.Fragment key={index}>
						<div className={classes.statsContainer}>
							<Typography variant="h6" component="h2">
								Session {statsRow.id}
							</Typography>
							<Typography>Started: {statsRow.date.toLocaleString()}</Typography>
							<Typography>Score: {statsRow.score}</Typography>
							<Typography>Difficulty: {statsRow.difficulty}</Typography>
							<Typography>Language: {statsRow.language}</Typography>
							<Typography>{statsRow.ended ? 'Completed' : 'Uncompleted'}</Typography>
							<Typography>
								{statsRow.playedWords ? statsRow.playedWords.length : 0}/{statsRow.words.length}
								words played
							</Typography>
							{statsRow.playedWords &&
							statsRow.playedWords.length > 0 && <SessionWordsStats stats={statsRow.playedWords} />}
							{!statsRow.ended && (
								<Button
									variant="contained"
									color="primary"
									onClick={() => {
										handleResumeSession(statsRow.id);
									}}
								>
									continue
								</Button>
							)}
						</div>
						<Divider />
					</React.Fragment>
				))
			) : (
				<React.Fragment>
					<Typography>You didn't played any session yet</Typography>
					<br />
					<Button variant="contained" color="primary" onClick={handleFirstSession}>
						first session
					</Button>
				</React.Fragment>
			)}
		</div>
	);
};

export default StatesPage;
