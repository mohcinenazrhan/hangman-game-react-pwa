import React from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { blue, grey } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Home, Games, Assessment, AccountCircle } from '@material-ui/icons';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@material-ui/core';
import './App.css';
import GamePage from './pages/game/GamePage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import StatsPage from './pages/StatsPage';

const theme = createMuiTheme({
	palette: {
		primary: blue,
		secondary: grey,
		background: {
			default: '#ffffff'
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
	footer: {
		width: '100%',
		flexGrow: 1,
		position: 'fixed',
		bottom: 0,
		borderTop: '1px solid #eaeaea'
	},
	justifyContent: {
		justifyContent: 'space-between'
	}
}));

function App() {
	const classes = useStyles();
	const [ value, setValue ] = React.useState(0);

	const [ auth ] = React.useState(true);
	const [ anchorEl, setAnchorEl ] = React.useState(null);
	const open = Boolean(anchorEl);

	// State for the current page
	const [ page, setPage ] = React.useState('home');
	// State for resumeSessionId
	const [ resumeSessionId, setResumeSessionId ] = React.useState(null);

	function handleMenu(event) {
		setAnchorEl(event.currentTarget);
	}

	function handleClose() {
		setAnchorEl(null);
	}

	function handleTabChange(event, newValue) {
		setValue(newValue);
		switch (newValue) {
			case 0:
				setPage('home');
				break;
			case 1:
				setPage('game');
				break;
			case 2:
				setPage('stats');
				break;

			default:
				setPage('home');
				break;
		}
	}

	function goToPage(page) {
		setPage(page);
		switch (page) {
			case 'home':
				setValue(0);
				break;
			case 'game':
				setValue(1);
				break;
			case 'stats':
				setValue(2);
				break;

			default:
				setValue(0);
				break;
		}
	}

	function resumeSession(id) {
		setResumeSessionId(id);
		goToPage('game');
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<div className={'App ' + classes.root}>
				<AppBar position="fixed">
					<Toolbar className={classes.justifyContent}>
						<Typography variant="h6" noWrap>
							Hangman Game
						</Typography>
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
				<Container maxWidth="lg">
					<div className={classes.toolbar} />
					<main className={classes.content}>
						{page === 'home' && <HomePage goToPage={goToPage} />}
						{page === 'game' && <GamePage resumeSessionId={resumeSessionId} />}
						{page === 'stats' && <StatsPage resumeSession={resumeSession} />}
						{page === 'about' && <AboutPage />}
					</main>
					<div className={classes.toolbar} />
				</Container>
				<footer className={classes.footer}>
					<Paper square>
						<Tabs
							value={value}
							onChange={handleTabChange}
							variant="fullWidth"
							indicatorColor="secondary"
							textColor="secondary"
						>
							<Tab icon={<Home />} label="Home" />
							<Tab icon={<Games />} label="Play" />
							<Tab icon={<Assessment />} label="My stats" />
						</Tabs>
					</Paper>
				</footer>
			</div>
		</ThemeProvider>
	);
}

export default App;
