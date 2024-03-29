import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		margin: theme.spacing(1, 0),
		overflowX: 'auto',
		border: '1px solid #E0E0E0',
		borderRadius: '5px'
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

const SessionWordsStats = ({ stats }) => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Table className={classes.table} size="small">
				<TableHead>
					<TableRow>
						<TableCell>Word</TableCell>
						<TableCell>State</TableCell>
						<TableCell align="right">Points</TableCell>
						<TableCell align="right">Misses</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{stats.map((row, index) => (
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
								{`${row.score}/${row.pointsToGain}`}
							</TableCell>
							<TableCell className={classes.tableCell} align="right">
								{`${row.misses}/${row.wrongGuessAllowed}`}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default SessionWordsStats;

SessionWordsStats.propTypes = {
	stats: PropTypes.array.isRequired
};
