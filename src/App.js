import React from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { blue, grey } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Home, Info, Assessment, AccountCircle } from '@material-ui/icons';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@material-ui/core';
import './App.css';

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
		padding: theme.spacing(3)
	},
	footer: {
		width: '100%',
		flexGrow: 1,
		position: 'fixed',
		bottom: 0,
		borderTop: '1px solid #eaeaea'
	}
}));

function App() {
	const classes = useStyles();
	const [ value, setValue ] = React.useState(0);

	const [ auth ] = React.useState(true);
	const [ anchorEl, setAnchorEl ] = React.useState(null);
	const open = Boolean(anchorEl);

	function handleMenu(event) {
		setAnchorEl(event.currentTarget);
	}

	function handleClose() {
		setAnchorEl(null);
	}

	function handleChange(event, newValue) {
		setValue(newValue);
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<div className={'App ' + classes.root}>
				<AppBar position="fixed">
					<Toolbar>
						<Typography variant="h6" noWrap align="center">
							App name
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
					<main className={classes.content}>My App</main>
					<div className={classes.toolbar} />
				</Container>
				<footer className={classes.footer}>
					<Paper square>
						<Tabs
							value={value}
							onChange={handleChange}
							variant="fullWidth"
							indicatorColor="secondary"
							textColor="secondary"
						>
							<Tab icon={<Home />} label="Home" />
							<Tab icon={<Assessment />} label="My States" />
							<Tab icon={<Info />} label="About" />
						</Tabs>
					</Paper>
				</footer>
			</div>
		</ThemeProvider>
	);
}

export default App;
