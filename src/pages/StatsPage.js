import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles, lighten } from '@material-ui/core/styles';
import { Typography, Divider, Button, Paper, LinearProgress } from '@material-ui/core';
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
		width: '100%',
		overflowX: 'auto'
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
		margin: theme.spacing(2, 0),
		padding: theme.spacing(0.5, 1),
		textAlign: 'left'
	},
	statsHeader: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	statsInfo: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	progressInfoContainer: {
		display: 'flex',
		flexWrap: 'nowrap',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%'
	},
	actionContainer: {
		display: 'flex',
		justifyContent: 'flex-end',
		margin: theme.spacing(1, 0)
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
							<div className={classes.statsInfo}>
								<Typography variant="body2">{`${statsRow.language}, ${statsRow.difficulty}`}</Typography>
								<Typography variant="body2">{`${statsRow.score} Points`}</Typography>
							</div>
							<div>
								<div className={classes.progressInfoContainer}>
									<Typography variant="body2">
										{statsRow.playedWords ? statsRow.playedWords.length : 0}/{statsRow.words.length}{' '}
										words played
									</Typography>
									<Typography variant="body2">
										{`${Math.floor(statsRow.playedWords.length * 100 / statsRow.words.length)}%`}
									</Typography>
								</div>
								<BorderLinearProgress
									variant="determinate"
									color="secondary"
									value={statsRow.playedWords.length * 100 / statsRow.words.length}
								/>
							</div>
							{statsRow.playedWords &&
							statsRow.playedWords.length > 0 && <SessionWordsStats stats={statsRow.playedWords} />}
							{statsRow.state === 'Uncompleted' && (
								<div className={classes.actionContainer}>
									<Button
										variant="contained"
										color="primary"
										size="small"
										onClick={() => {
											handleResumeSession(statsRow.id);
										}}
									>
										continue
									</Button>
								</div>
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
