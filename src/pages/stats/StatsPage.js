import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Typography,
	Button,
	Divider,
	FormControl,
	FormControlLabel,
	FormLabel,
	RadioGroup,
	Radio
} from '@material-ui/core';
import LocalDb from '../../LocalDb';
import SessionStats from './components/SessionStats';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%'
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120
	},
	group: {
		margin: theme.spacing(1, 0),
		flexWrap: 'nowrap',
		flexDirection: 'row'
	}
}));

const StatesPage = ({ resumeSession, goToPage }) => {
	const classes = useStyles();
	const [ stats, setStats ] = useState([]);
	const [ isReady, setIsReady ] = useState(false);
	const [ listedSessionState, setListedSessionState ] = useState('All');

	useEffect(
		() => {
			LocalDb.getLastSessions(listedSessionState)
				.then((rows) => {
					setStats(rows);
					setIsReady(true);
				})
				.catch((error) => {
					console.log('error: ' + error);
				});
		},
		[ listedSessionState ]
	);

	function handleListedSessionStateChange(event) {
		setListedSessionState(event.target.value);
	}

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
				<React.Fragment>
					<div>
						<Typography variant="h6" component="h2">
							Filters
						</Typography>
						<FormControl component="fieldset" className={classes.formControl}>
							<FormLabel component="legend">Session State</FormLabel>
							<RadioGroup
								aria-label="Session State"
								name="sessionState"
								className={classes.group}
								value={listedSessionState}
								onChange={handleListedSessionStateChange}
							>
								<FormControlLabel value="All" control={<Radio />} label="All" />
								<FormControlLabel value="Completed" control={<Radio />} label="Completed" />
								<FormControlLabel value="Uncompleted" control={<Radio />} label="Uncompleted" />
							</RadioGroup>
						</FormControl>
					</div>
					{stats.map((statsRow, index) => (
						<React.Fragment key={index}>
							<SessionStats stats={statsRow} handleResumeSession={handleResumeSession} />
							{index < stats.length - 1 && <Divider />}
						</React.Fragment>
					))}
				</React.Fragment>
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
