import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button, Divider } from '@material-ui/core';
import LocalDb from '../../LocalDb';
import SessionStats from './components/SessionStats';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%'
	}
}));

const StatesPage = ({ resumeSession, goToPage }) => {
	const classes = useStyles();
	const [ stats, setStats ] = useState([]);
	const [ isReady, setIsReady ] = useState(false);

	useEffect(() => {
		LocalDb.getLastSessions()
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
			<Typography variant="h5" component="h1">
				My sessions stats
			</Typography>
			{isReady ? stats.length > 0 ? (
				stats.map((statsRow, index) => (
					<React.Fragment key={index}>
						<SessionStats stats={statsRow} handleResumeSession={handleResumeSession} />
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
