import React from 'react';
import Game from './components/Game';
import PropTypes from 'prop-types';
import { usePrepGameState } from './usePrepGameState';

const ResumePage = ({ updatePoints, resumeSessionId, goToPage }) => {
	const { valueDifficulty, alphabets, words, isReady } = usePrepGameState('resumeSession', resumeSessionId);

	function updateUserPoints(newPoints) {
		updatePoints(newPoints);
	}

	function prepareNewSession() {
		goToPage('game');
	}

	return (
		<React.Fragment>
			{!isReady ? (
				'Preparing'
			) : (
				<Game
					alphabets={alphabets}
					difficulty={valueDifficulty}
					words={words}
					updateUserPoints={updateUserPoints}
					prepareNewSession={prepareNewSession}
					id={resumeSessionId}
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
