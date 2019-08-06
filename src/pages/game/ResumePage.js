import React from 'react';
import Game from './components/Game';
import PropTypes from 'prop-types';
import { usePrepGameState } from './usePrepGameState';

const ResumePage = ({ updatePoints, resumeSessionId, goToPage, modeFullScreen }) => {
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
				'Preparing'
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
