import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Divider, Button, Paper } from '@material-ui/core';
import LocalDb from '../LocalDb';
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
		padding: theme.spacing(0.5, 1),
		textAlign: 'left'
	},
	statsHeader: {
		display: 'flex',
		justifyContent: 'space-between'
	}
}));

const StatesPage = ({ resumeSession, goToPage }) => {
	const classes = useStyles();
	const [ stats, setStats ] = useState([]);
	const [ isReady, setIsReady ] = useState(false);

	useEffect(() => {
		LocalDb.getLastSessions(5)
			.then((rows) => {
				setStats(rows);
				setIsReady(true);
			})
			.catch((error) => {
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
			{isReady ? stats.length > 0 ? (
				stats.map((statsRow, index) => (
					<React.Fragment key={index}>
						<Paper className={classes.statsContainer}>
							<div className={classes.statsHeader}>
								<Typography variant="h6" component="h2">
									{`Session ${statsRow.id}`}
								</Typography>
								<Typography variant="overline" display="block" gutterBottom>
									{statsRow.date.toLocaleString()}
								</Typography>
							</div>
							<Typography>{`${statsRow.language}, ${statsRow.difficulty}`}</Typography>
							<Typography>Score: {statsRow.score}</Typography>
							<Typography>{statsRow.state}</Typography>
							<Typography>
								{statsRow.playedWords ? statsRow.playedWords.length : 0}/{statsRow.words.length} words
								played
							</Typography>
							{statsRow.playedWords &&
							statsRow.playedWords.length > 0 && <SessionWordsStats stats={statsRow.playedWords} />}
							{statsRow.state === 'Uncompleted' && (
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
						</Paper>
						{index < stats.length - 1 && <Divider />}
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
			) : (
				'Loading...'
			)}
		</div>
	);
};

export default StatesPage;
