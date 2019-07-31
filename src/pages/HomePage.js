import React from 'react';
import { Typography, Button, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	paper: {
		padding: theme.spacing(1.5, 1),
		margin: theme.spacing(2, 0),
		background: '#FAFAFA',
		textAlign: 'left',
		display: 'flex',
		justifyContent: 'space-between',
		flexWrap: 'wrap'
	},
	paperInfoContainer: {},
	paperActionContainer: {
		alignSelf: 'center'
	},
	link: {
		margin: theme.spacing(1)
	},
	button: {
		margin: theme.spacing(0.5),
		padding: 0,
		fontWeight: 'bold',
		[theme.breakpoints.up('sm')]: {
			margin: theme.spacing(1),
			padding: '6px 16px'
		}
	},
	marginTopBottom: {
		marginTop: theme.spacing(5),
		marginBottom: theme.spacing(5)
	}
}));

const HomePage = ({ goToPage }) => {
	const classes = useStyles();

	function handleNewSessionClick() {
		goToPage('game');
	}

	function handleContinueClick() {}

	return (
		<React.Fragment>
			<Typography variant="h4" component="h1">
				Play and improve your English
			</Typography>
			<section className={classes.marginTopBottom}>
				<Typography variant="h5" component="h2">
					Pick up where you left off
				</Typography>
				<Paper className={classes.paper}>
					<div className={classes.paperInfoContainer}>
						<Typography variant="h6" component="h3">
							Session 3
						</Typography>
						<Typography component="p">5 Words left to discover</Typography>
					</div>
					<div className={classes.paperActionContainer}>
						<Button variant="contained" color="primary" onClick={handleContinueClick}>
							Continue
						</Button>
					</div>
				</Paper>
				<Paper className={classes.paper}>
					<div className={classes.paperInfoContainer}>
						<Typography variant="h6" component="h3">
							Session 2
						</Typography>
						<Typography component="p">2 Words left to discover</Typography>
					</div>
					<div className={classes.paperActionContainer}>
						<Button variant="contained" color="primary" onClick={handleContinueClick}>
							Continue
						</Button>
					</div>
				</Paper>
				<Paper className={classes.paper}>
					<div className={classes.paperInfoContainer}>
						<Typography variant="h6" component="h3">
							Session 1
						</Typography>
						<Typography component="p">3 Words left to discover</Typography>
					</div>
					<div className={classes.paperActionContainer}>
						<Button variant="contained" color="primary" onClick={handleContinueClick}>
							Continue
						</Button>
					</div>
				</Paper>
			</section>
			<Button variant="contained" color="primary" className={classes.button} onClick={handleNewSessionClick}>
				New Session
			</Button>
		</React.Fragment>
	);
};

export default HomePage;
