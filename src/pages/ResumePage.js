import React from 'react';
import GamePage from './GamePage';
import PropTypes from 'prop-types';
import { usePrepGameState } from '../hooks/usePrepGameState';
import SpinnerLoader from '../components/SpinnerLoader';
import { useAppDispatch } from '../context/app-context';

const ResumePage = ({ updatePoints, resumeSessionId }) => {
	const { valueDifficulty, valueLanguage, alphabets, words, isReady, resumeData } = usePrepGameState(
		'resumeSession',
		resumeSessionId
	);

	const dispatch = useAppDispatch();

	function updateUserPoints(newPoints) {
		updatePoints(newPoints);
	}

	function prepareNewSession() {
		dispatch({ type: 'NAVIGATE_TO_PAGE', page: 'game' });
		dispatch({ type: 'MODE_NAVIGATE' });
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
					prepareNewSession={prepareNewSession}
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
