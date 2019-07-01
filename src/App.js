import React from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { blue, grey } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
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
	}
}));

function App() {
	const classes = useStyles();

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<div className={'App ' + classes.root}>
				<Container maxWidth="lg">
					<div className={classes.toolbar} />
					<main className={classes.content}>My App</main>
					<div className={classes.toolbar} />
				</Container>
			</div>
		</ThemeProvider>
	);
}

export default App;
