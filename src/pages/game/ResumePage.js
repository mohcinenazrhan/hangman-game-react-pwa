import React from 'react';
import Game from './components/Game';
import PropTypes from 'prop-types';
import { usePrepGameState } from './usePrepGameState';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	loaderContainer: {
		position: 'absolute',
		left: '50%',
		top: '50%',
		transform: 'translate(-50%, -50%)'
	}
}));

const ResumePage = ({ updatePoints, resumeSessionId, goToPage, modeFullScreen }) => {
	const classes = useStyles();

	const { valueDifficulty, valueLanguage, alphabets, words, isReady, resumeData } = usePrepGameState(
		'resumeSession',
		resumeSessionId
	);

	function updateUserPoints(newPoints) {
		updatePoints(newPoints);
	}

	function prepareNewSession() {
		goToPage('game');
		modeFullScreen(false);
	}

	function quitSession() {
		goToPage('home');
		modeFullScreen(false);
	}

	return (
		<React.Fragment>
			{!isReady ? (
				<div className={classes.loaderContainer}>
					<p>Preparing the Game</p>
					<CircularProgress />
				</div>
			) : (
				<Game
					alphabets={alphabets}
					difficulty={valueDifficulty}
					language={valueLanguage}
					words={words}
					updateUserPoints={updateUserPoints}
					prepareNewSession={prepareNewSession}
					id={resumeSessionId}
					resumeData={resumeData}
					quitSession={quitSession}
				/>
			)}
		</React.Fragment>
	);
};

export default ResumePage;

ResumePage.propTypes = {
	resumeSessionId: PropTypes.number.isRequired,
	goToPage: PropTypes.func.isRequired,
	updatePoints: PropTypes.func.isRequired
};
