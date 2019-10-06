import React from 'react';
import { Home, Games, Assessment } from '@material-ui/icons';
import { Paper, Tabs, Tab, makeStyles } from '@material-ui/core';
import { useAppDispatch, useAppState } from '../context/app-context';

const useStyles = makeStyles((theme) => ({
	footer: {
		width: '100%',
		flexGrow: 1,
		position: 'fixed',
		bottom: 0,
		borderTop: '1px solid #eaeaea'
	}
}));

const NavBar = () => {
	const classes = useStyles();
	const dispatch = useAppDispatch();
	const state = useAppState();

	const [ value, setValue ] = React.useState(getPageIndex(state.page));

	function getPageIndex(page) {
		switch (page) {
			case 'home':
				return 0;
			case 'game':
			case 'resume':
				return 1;
			case 'stats':
				return 2;
			default:
				return 0;
		}
	}

	function handleTabChange(event, newValue) {
		setValue(newValue);
		switch (newValue) {
			case 0:
				dispatch({ type: 'NAVIGATE_TO_PAGE', page: 'home' });
				break;
			case 1:
				dispatch({ type: 'NAVIGATE_TO_PAGE', page: 'game' });
				break;
			case 2:
				dispatch({ type: 'NAVIGATE_TO_PAGE', page: 'stats' });
				break;

			default:
				dispatch({ type: 'NAVIGATE_TO_PAGE', page: 'home' });
				break;
		}
	}

	return (
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
	);
};

export default NavBar;
