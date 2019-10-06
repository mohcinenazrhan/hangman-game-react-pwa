import React from 'react';
import GamePage from './GamePage';
import PropTypes from 'prop-types';
import { usePrepGameState } from '../hooks/usePrepGameState';
import SpinnerLoader from '../components/SpinnerLoader';

const ResumePage = ({ updatePoints, resumeSessionId }) => {
	const { valueDifficulty, valueLanguage, alphabets, words, isReady, resumeData } = usePrepGameState(
		'resumeSession',
		resumeSessionId
	);

	function updateUserPoints(newPoints) {
		updatePoints(newPoints);
	}

	return (
		<React.Fragment>
			{!isReady ? (
				<SpinnerLoader message="Preparing the Game" fullPageCenter={true} />
			) : (
				<GamePage
					alphabets={alphabets}
					difficulty={valueDifficulty}
					language={valueLanguage}
					words={words}
					updateUserPoints={updateUserPoints}
					id={resumeSessionId}
					resumeData={resumeData}
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
