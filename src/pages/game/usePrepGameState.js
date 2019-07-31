import { useState, useEffect } from 'react';
import { helpers } from './helpers';
import LocalDb from '../../LocalDb';

// Custom hook prepare the game for new session or resume session
export const usePrepGameState = (type, resumeSessionId = null) => {
	const [ valueLanguage, setValueLanguage ] = useState('English');
	const [ valueDifficulty, setValueDifficulty ] = useState('Easy');
	const [ numberOfWords, setNumberOfWords ] = useState(5);
	const [ alphabets, setAlphabets ] = useState([]);
	const [ words, setWords ] = useState([]);
	const [ newSession, setNewSession ] = useState(false);
	// State for session ID
	const [ sessionId, setSessionId ] = useState(null);
	// State for the dependencies if ready
	const [ isReady, setIsReady ] = useState(false);
	// State for data to resume the session
	const [ resumeData, setResumeData ] = useState(null);

	useEffect(
		() => {
			if (type === 'resumeSession' && resumeSessionId !== null) {
				LocalDb.getDb()
					.table('sessions')
					.get(resumeSessionId, (object) => {
						setWords(object.words);
						setAlphabets(helpers.getAlphabetsForLang(object.language));
						setValueDifficulty(object.difficulty);
						setResumeData(object);
						setIsReady(true);
					})
					.catch((error) => {
						console.log('error: ' + error);
					});
			}

			if (type === 'newSession' && newSession) {
				// fetch('https://random-word-api.herokuapp.com/word?key=TE2AB90K&number=10')
				// 	.then((response) => response.json())
				// 	.then((data) => {
				// 		setWords(data);
				// 	})
				// 	.catch((error) => {
				// 		console.log('Error occure while trying to get response: ', error);
				// 	});

				// Load the appropriate words according to the language selected and number of the words wanted
				let sessionWords = [
					'neighborly',
					'tender',
					'tightfisted',
					'bag',
					'die',
					'sing',
					'pear',
					'ignore',
					'stale',
					'reflect',
					'sound',
					'orthographic',
					'distinguish',
					'diaeresis',
					'coming'
				];
				if (valueLanguage === 'Frensh') {
					sessionWords = [
						'ambiance',
						'gruyère',
						'dégât',
						'aïeul',
						'août',
						'henné',
						'secrète',
						'bêtise',
						'œstrogène',
						'sympa',
						'Toutefois',
						'présente',
						'français',
						'écriture',
						'Sommaire'
					];
				} else if (valueLanguage === 'Arabic') {
					sessionWords = [
						'الأبجدية',
						'اللغات',
						'تعتمد',
						'الكتابة',
						'الهمزة',
						'الشعبي',
						'عمودي',
						'دائري',
						'الترتيب',
						'أكبر',
						'علامة',
						'نصف',
						'اليسرى',
						'بلعومي',
						'مختلف'
					];
				}

				const wordsList = sessionWords.slice(0, numberOfWords);

				// Create session data for local db
				LocalDb.createNewSession(wordsList, valueLanguage, valueDifficulty)
					.then(function(id) {
						setSessionId(id);
						// Wait for the id to launch the game
						setWords(wordsList);
						setAlphabets(helpers.getAlphabetsForLang(valueLanguage));
						setIsReady(true);
					})
					.catch(function(error) {
						console.log('error: ' + error);
					});
			}
		},
		[ resumeSessionId, newSession, valueLanguage, valueDifficulty, numberOfWords, type ]
	);

	return {
		newSession,
		sessionId,
		numberOfWords,
		valueLanguage,
		valueDifficulty,
		alphabets,
		words,
		isReady,
		resumeData,
		setValueLanguage,
		setValueDifficulty,
		setNumberOfWords,
		setNewSession
	};
};
