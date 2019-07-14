import React from 'react';
import { Typography, Button } from '@material-ui/core';

const HomePage = ({ changeCurrentPage }) => {
	return (
		<React.Fragment>
			<Typography variant="h4" component="h1">
				Customize your game session
			</Typography>
			<Button onClick={() => changeCurrentPage('game')}>Start new session</Button>
		</React.Fragment>
	);
};

export default HomePage;
