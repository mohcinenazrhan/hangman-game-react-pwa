import React from 'react';
import Game from './components/Game';
import db from '../../LocalDb';
import PropTypes from 'prop-types';
import { helpers } from './helpers';

const ResumePage = ({ updatePoints, resumeSessionId, goToPage }) => {
	const [ valueDifficulty, setValueDifficulty ] = React.useState('Easy');
	const [ alphabets, setAlphabets ] = React.useState([]);
	const [ words, setWords ] = React.useState([]);

	// State for the dependencies if ready
	const [ isReady, setIsReady ] = React.useState(false);

	React.useEffect(
		() => {
			if (resumeSessionId !== null) {
				db
					.table('sessions')
					.get(resumeSessionId, (object) => {
						setWords(object.words);
						setAlphabets(helpers.getAlphabetsForLang(object.language));
						setValueDifficulty(object.difficulty);
						setIsReady(true);
					})
					.catch(function(error) {
						console.log('error: ' + error);
					});
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ resumeSessionId ]
	);

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
