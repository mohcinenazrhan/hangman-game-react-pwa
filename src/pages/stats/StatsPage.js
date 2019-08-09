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
import SpinnerLoader from '../common/SpinnerLoader';

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
		flexDirection: 'row',
		justifyContent: 'space-around'
	}
}));

const StatesPage = ({ resumeSession, goToPage }) => {
	const classes = useStyles();
	const [ stats, setStats ] = useState([]);
	const [ statsOgirinState, setStatsOriginState ] = useState([]);
	const [ isReady, setIsReady ] = useState(false);
	const [ itHasSessions, setItHasSessions ] = useState(false);
	const [ listedSessionState, setListedSessionState ] = useState('All');
	const [ nbrOfSessions, setNbrOfSessions ] = useState({
		all: 0,
		completed: 0,
		uncompleted: 0
	});

	useEffect(() => {
		LocalDb.getAllSessions()
			.then((rows) => {
				setNbrOfSessions({
					all: rows.length,
					completed: rows.filter((row) => row.state === 'Completed').length,
					uncompleted: rows.filter((row) => row.state === 'Uncompleted').length
				});
				setStats(rows.slice(0, 3));
				setStatsOriginState(rows);
				setIsReady(true);
				setItHasSessions(rows.length > 0);
			})
			.catch((error) => {
				console.log('error: ' + error);
			});
	}, []);

	function handleListedSessionStateChange(event) {
		setListedSessionState(event.target.value);
		if (event.target.value === 'All') setStats(statsOgirinState.slice(0, 3));
		else setStats(statsOgirinState.filter((row) => row.state === event.target.value).slice(0, 3));
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
			{isReady ? (
				<React.Fragment>
					{itHasSessions ? (
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
										<FormControlLabel
											value="All"
											control={<Radio />}
											label={`All (${nbrOfSessions.all})`}
										/>
										<FormControlLabel
											value="Completed"
											control={<Radio />}
											label={`Completed (${nbrOfSessions.completed})`}
										/>
										<FormControlLabel
											value="Uncompleted"
											control={<Radio />}
											label={`Uncompleted (${nbrOfSessions.uncompleted})`}
										/>
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
					)}
				</React.Fragment>
			) : (
				<SpinnerLoader />
			)}
		</div>
	);
};

export default StatesPage;
