import React from 'react';
import Game from './components/Game';
import db from '../../LocalDb';

const ResumePage = ({ resumeSessionId }) => {
	const [ valueDifficulty, setValueDifficulty ] = React.useState('Easy');
	const [ points, setPoints ] = React.useState(null);
	const [ alphabets, setAlphabets ] = React.useState([]);
	const [ words, setWords ] = React.useState([]);
	const [ newSession, setNewSession ] = React.useState(resumeSessionId !== null);

	// State for the dependencies if ready
	const [ isReady, setIsReady ] = React.useState(false);

	function getAlphabetsForLang(language) {
		// Set the appropriate alphabets according the language selected
		let alphabets = 'abcdefghijklmnopqrstuvwxyz';
		if (language === 'Frensh') alphabets = 'abcdefghijklmnopqrstuvwxyzéèàçù';
		else if (language === 'Arabic') alphabets = 'يوهنملكقفغعظطضصشسزرذدخحجثتبأ';
		// Array alphabets letters
		return alphabets.toUpperCase().split('');
	}

	React.useEffect(
		() => {
			if (resumeSessionId !== null) {
				db
					.table('sessions')
					.get(resumeSessionId, (object) => {
						setWords(object.words);
						setAlphabets(getAlphabetsForLang(object.language));
						setValueDifficulty(object.difficulty);
						setIsReady(true);
					})
					.catch(function(error) {
						console.log('error: ' + error);
					});
			}

			if (!newSession) {
				const pointsTimeout = setTimeout(() => {
					setPoints(13);
				}, 2000);
				return () => {
					clearTimeout(pointsTimeout);
				};
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ newSession, resumeSessionId ]
	);

	function updateUserPoints(newPoints) {
		setPoints(newPoints);
	}

	function prepareNewSession() {
		setNewSession(false);
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
					points={points}
					updateUserPoints={updateUserPoints}
					prepareNewSession={prepareNewSession}
					id={resumeSessionId}
				/>
			)}
		</React.Fragment>
	);
};

export default ResumePage;
