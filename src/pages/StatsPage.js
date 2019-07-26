import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Typography,
	Paper,
	Table,
	TableRow,
	TableHead,
	TableCell,
	TableBody,
	Divider,
	Button
} from '@material-ui/core';
import clsx from 'clsx';
import db from '../LocalDb';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%'
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

const StatesPage = ({ resumeSession }) => {
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

	return (
		<div className={classes.root}>
			{stats.length > 0 && (
				<React.Fragment>
					<Typography variant="h5" component="h1">
						My sessions stats
					</Typography>
					{stats.map((statsRow, index) => (
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
								statsRow.playedWords.length > 0 && (
									<Paper className={classes.paper}>
										<Table className={classes.table} size="small">
											<TableHead>
												<TableRow>
													<TableCell>Word</TableCell>
													<TableCell>State</TableCell>
													<TableCell align="right">Score</TableCell>
													<TableCell align="right">Misses</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{statsRow.playedWords.map((row, index) => (
													<TableRow key={index}>
														<TableCell
															className={clsx(
																classes.tableCell,
																row.result === 'succeed' && classes.succeed,
																row.result === 'failed' && classes.failed
															)}
														>
															{row.word}
														</TableCell>
														<TableCell className={classes.tableCell}>
															{row.wordState.map((item, i) => {
																return (
																	<span
																		key={i}
																		className={clsx(
																			item.state === 'found' &&
																				classes.letterFound,
																			item.state === 'show' && classes.letterShow
																		)}
																	>
																		{item.letter}
																	</span>
																);
															})}
														</TableCell>
														<TableCell className={classes.tableCell} align="right">
															{row.score > 1 ? (
																`${row.score} Points`
															) : (
																`${row.score} Point`
															)}
														</TableCell>
														<TableCell className={classes.tableCell} align="right">
															{`${row.misses}/${row.wrongGuessAllowed}`}
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</Paper>
								)}
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
					))}
				</React.Fragment>
			)}
		</div>
	);
};

export default StatesPage;
