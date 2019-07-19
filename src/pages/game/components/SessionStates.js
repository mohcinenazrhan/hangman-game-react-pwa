import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';

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
	}
}));

const rows = [
	{
		word: 'neighborly',
		result: 'failed',
		wordState: [
			{ letter: 'N', state: 'found' },
			{ letter: 'E', state: 'show' },
			{ letter: 'I', state: 'show' },
			{ letter: 'G', state: 'show' },
			{ letter: 'H', state: 'show' },
			{ letter: 'B', state: 'show' },
			{ letter: 'O', state: 'found' },
			{ letter: 'R', state: 'found' },
			{ letter: 'L', state: 'found' },
			{ letter: 'Y', state: 'found' }
		],
		score: 0,
		nbrTries: 10
	},
	{
		word: 'bag',
		result: 'succeed',
		wordState: [
			{ letter: 'B', state: 'found' },
			{ letter: 'A', state: 'found' },
			{ letter: 'G', state: 'found' }
		],
		score: 3,
		nbrTries: 3
	}
];
const SessionStates = () => {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<Table className={classes.table} size="small">
					<TableHead>
						<TableRow>
							<TableCell>Word</TableCell>
							<TableCell>State</TableCell>
							<TableCell align="right">Score</TableCell>
							<TableCell align="right">Tries</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row, index) => (
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
													item.state === 'found' && classes.letterFound,
													item.state === 'show' && classes.letterShow
												)}
											>
												{item.letter}
											</span>
										);
									})}
								</TableCell>
								<TableCell className={classes.tableCell} align="right">
									{row.score}
								</TableCell>
								<TableCell className={classes.tableCell} align="right">
									{row.nbrTries}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Paper>
		</div>
	);
};

export default SessionStates;
