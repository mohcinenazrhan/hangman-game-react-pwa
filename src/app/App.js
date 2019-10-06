import React from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { blue, grey } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AccountCircle } from '@material-ui/icons';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@material-ui/core';
import clsx from 'clsx';
import './App.css';
import SessionPage from './../pages/SessionPage';
import HomePage from './../pages/HomePage';
import AboutPage from './../pages/AboutPage';
import StatsPage from './../pages/StatsPage';
import ResumePage from './../pages/ResumePage';
import NavBar from './../components/NavBar';
import { useAppDispatch, useAppState } from '../context/app-context';

const theme = createMuiTheme({
	palette: {
		primary: blue,
		secondary: grey,
		background: {
			default: '#ffffff'
		}
	},
	overrides: {
		MuiDialog: {
			paper: {
				margin: 0
			}
		},
		MuiButton: {
			root: {
				minWidth: 48,
				minHeight: 48
			}
		}
	}
});

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex'
	},
	toolbar: theme.mixins.toolbar,
	content: {
		flexGrow: 1,
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3)
	},
	justifyContent: {
		justifyContent: 'space-between'
	}
}));

function App() {
	const classes = useStyles();
	const dispatch = useAppDispatch();
	const state = useAppState();

	const [ auth ] = React.useState(true);
	const [ anchorEl, setAnchorEl ] = React.useState(null);
	const open = Boolean(anchorEl);

	// State for resumeSessionId
	const [ resumeSessionId, setResumeSessionId ] = React.useState(null);
	// State for current user score points
	const [ points, setPoints ] = React.useState(0);
	// State for full screen
	const [ fullScreen, setFullScreen ] = React.useState(false);

	React.useEffect(() => {
		const userPoints = localStorage.getItem('userPoints');
		if (userPoints !== null) setPoints(parseInt(localStorage.getItem('userPoints')));
		else localStorage.setItem('userPoints', 0);
	}, []);

	function updatePoints(pointsToAdd) {
		const newPoints = points + pointsToAdd;
		setPoints(newPoints);
		localStorage.setItem('userPoints', newPoints);
	}

	function handleMenu(event) {
		setAnchorEl(event.currentTarget);
	}

	function handleClose() {
		setAnchorEl(null);
	}

	function goToPage(page) {
		return dispatch({ type: 'NAVIGATE_TO_PAGE', page });
	}

	function resumeSession(id) {
		setResumeSessionId(id);
		setFullScreen(true);
		dispatch({ type: 'NAVIGATE_TO_PAGE', page: 'resume' });
	}

	function isNotFullScreen() {
		return fullScreen === false;
	}

	function modeFullScreen(value) {
		setFullScreen(value);
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<div className={'App ' + classes.root}>
				{isNotFullScreen() && (
					<AppBar position="fixed">
						<Toolbar className={classes.justifyContent}>
							<Typography variant="h6" noWrap>
								Hangman Game
							</Typography>
							<Typography>{points} points</Typography>
							{auth && (
								<div>
									<IconButton
										aria-label="Account of current user"
										aria-controls="menu-appbar"
										aria-haspopup="true"
										onClick={handleMenu}
										color="inherit"
									>
										<AccountCircle />
									</IconButton>
									<Menu
										id="menu-appbar"
										anchorEl={anchorEl}
										anchorOrigin={{
											vertical: 'top',
											horizontal: 'right'
										}}
										keepMounted
										transformOrigin={{
											vertical: 'top',
											horizontal: 'right'
										}}
										open={open}
										onClose={handleClose}
									>
										<MenuItem onClick={handleClose}>Profile</MenuItem>
										<MenuItem onClick={handleClose}>My account</MenuItem>
									</Menu>
								</div>
							)}
						</Toolbar>
					</AppBar>
				)}
				<Container maxWidth="lg">
					{isNotFullScreen() && <div className={classes.toolbar} />}
					<main className={clsx(fullScreen === false && classes.content)}>
						{state.page === 'home' && <HomePage goToPage={goToPage} resumeSession={resumeSession} />}
						{state.page === 'game' && (
							<SessionPage
								goToPage={goToPage}
								updatePoints={updatePoints}
								modeFullScreen={modeFullScreen}
							/>
						)}
						{state.page === 'resume' && (
							<ResumePage
								updatePoints={updatePoints}
								resumeSessionId={resumeSessionId}
								goToPage={goToPage}
								modeFullScreen={modeFullScreen}
							/>
						)}
						{state.page === 'stats' && <StatsPage resumeSession={resumeSession} goToPage={goToPage} />}
						{state.page === 'about' && <AboutPage goToPage={goToPage} />}
					</main>
					{isNotFullScreen() && <div className={classes.toolbar} />}
				</Container>
				{isNotFullScreen() && <NavBar />}
			</div>
		</ThemeProvider>
	);
}

export default App;
