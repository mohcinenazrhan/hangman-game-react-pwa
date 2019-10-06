import React from 'react';
import { makeStyles, withStyles, lighten } from '@material-ui/core/styles';
import { Typography, Button, Paper, LinearProgress, IconButton, Collapse } from '@material-ui/core';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SessionWordsStats from './SessionWordsStats';
import { useAppDispatch } from '../context/app-context';

const useStyles = makeStyles((theme) => ({
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
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: theme.spacing(1)
	},
	expand: {
		transform: 'rotate(0deg)',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest
		})
	},
	expandOpen: {
		transform: 'rotate(180deg)'
	},
	expandHide: {
		visibility: 'hidden'
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

const SessionStats = ({ stats, index }) => {
	const classes = useStyles();
	const dispatch = useAppDispatch();

	const [ expanded, setExpanded ] = React.useState(false);

	function handleExpandClick() {
		setExpanded(!expanded);
	}

	return (
		<Paper className={classes.statsContainer}>
			<div className={classes.statsHeader}>
				<Typography variant="h6" component="h2">
					{`Session ${stats.id}`}
				</Typography>
				<Typography variant="overline" display="block" gutterBottom>
					{stats.date.toLocaleString()}
				</Typography>
			</div>
			<div className={classes.statsInfo}>
				<Typography variant="body2">{`${stats.language}, ${stats.difficulty}`}</Typography>
				<Typography variant="body2">{`${stats.score} Points`}</Typography>
			</div>
			<div>
				<div className={classes.progressInfoContainer}>
					<Typography variant="body2">
						{stats.playedWords ? stats.playedWords.length : 0}/{stats.words.length} words played
					</Typography>
					<Typography variant="body2">
						{`${Math.floor(stats.playedWords.length * 100 / stats.words.length)}%`}
					</Typography>
				</div>
				<BorderLinearProgress
					variant="determinate"
					color="secondary"
					value={stats.playedWords.length * 100 / stats.words.length}
				/>
			</div>

			{stats.playedWords &&
			stats.playedWords.length > 0 && (
				<Collapse in={expanded} timeout="auto" unmountOnExit>
					<SessionWordsStats stats={stats.playedWords} />
				</Collapse>
			)}

			<div className={classes.actionContainer}>
				<IconButton
					className={clsx(classes.expand, {
						[classes.expandOpen]: expanded,
						[classes.expandHide]: stats.playedWords.length === 0
					})}
					onClick={handleExpandClick}
					aria-expanded={expanded}
					aria-label="show words stats"
				>
					<ExpandMoreIcon />
				</IconButton>

				{stats.state === 'Uncompleted' && (
					<Button
						variant="contained"
						color="primary"
						size="small"
						onClick={() => {
							dispatch({ type: 'RESUME_SESSION', id: stats.id });
						}}
					>
						continue
					</Button>
				)}
			</div>
		</Paper>
	);
};

export default SessionStats;
