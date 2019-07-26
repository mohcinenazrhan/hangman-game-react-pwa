import React from 'react';
import {
	Typography,
	Button,
	FormControl,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
	Input
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Game from './components/Game';
import Dexie from 'dexie';

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120
	},
	selectEmpty: {
		marginTop: theme.spacing(2)
	},
	group: {
		margin: theme.spacing(1, 0),
		flexWrap: 'nowrap',
		flexDirection: 'row'
	},
	marginTopBottom: {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3)
	}
}));

const GamePage = () => {
	const classes = useStyles();
	const NumberOfWordsRange = {
		min: '1',
		max: '15'
	};

	const [ valueLanguage, setValueLanguage ] = React.useState('English');
	const [ valueDifficulty, setValueDifficulty ] = React.useState('Easy');
	const [ numberOfWords, setNumberOfWords ] = React.useState(5);
	const [ points, setPoints ] = React.useState(null);
	const [ alphabets, setAlphabets ] = React.useState([]);
	const [ words, setWords ] = React.useState([]);
	const [ newSession, setNewSession ] = React.useState(false);
	const [ invalidNbrWordsInput, setInvalidNbrWordsInput ] = React.useState(false);

	// State for the dependencies if ready
	const [ isReady, setIsReady ] = React.useState(false);
	// State for session ID
	const [ sessionId, setSessionId ] = React.useState(null);

	// Define the database
	const db = new Dexie('sessionsDb');
	db.version(1).stores({
		sessions: '++id,date,ended,score'
	});

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
			if (!newSession) {
				const pointsTimeout = setTimeout(() => {
					setPoints(13);
				}, 2000);
				return () => {
					clearTimeout(pointsTimeout);
				};
			} else {
				console.log(valueLanguage, valueDifficulty, numberOfWords);

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
				db.sessions
					.put({
						date: new Date(),
						ended: false,
						words: wordsList,
						language: valueLanguage,
						difficulty: valueDifficulty,
						playedWords: []
					})
					.then(function(id) {
						setSessionId(id);
						// Wait for the id to launch the game
						setWords(wordsList);
						setAlphabets(getAlphabetsForLang(valueLanguage));
						setIsReady(true);
					})
					.catch(function(error) {
						alert('error: ' + error);
					});
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ newSession, valueLanguage, valueDifficulty, numberOfWords ]
	);

	function handleLanguageChange(event) {
		setValueLanguage(event.target.value);
	}

	function handleDifficultyChange(event) {
		setValueDifficulty(event.target.value);
	}

	function handleNumberOfWordsChange(event) {
		/* Allow empty value pass to let the user remove default value and add its own,
		since on mobile the number input doesn't fully support the arrows for increase and decrease */

		if (
			(parseInt(event.target.value) >= parseInt(NumberOfWordsRange.min) &&
				parseInt(event.target.value) <= parseInt(NumberOfWordsRange.max)) ||
			event.target.value === ''
		)
			if (event.target.value === '') setInvalidNbrWordsInput(true);
			else setInvalidNbrWordsInput(false);

		setNumberOfWords(event.target.value);
	}

	function updateUserPoints(newPoints) {
		setPoints(newPoints);
	}

	function startNewSession() {
		setNewSession(true);
	}

	function prepareNewSession() {
		setNewSession(false);
	}

	return (
		<React.Fragment>
			{newSession === false ? (
				<React.Fragment>
					{points && <Typography>Your total score: {points}</Typography>}
					<Typography variant="h4" component="h1">
						Customize your game session
					</Typography>
					<div className={classes.marginTopBottom}>
						<FormControl className={classes.formControl}>
							<InputLabel shrink htmlFor="language-label-placeholder">
								Languages
							</InputLabel>
							<Select
								value={valueLanguage}
								onChange={handleLanguageChange}
								input={<Input name="language" id="language-label-placeholder" />}
								displayEmpty
								name="language"
								className={classes.selectEmpty}
							>
								<MenuItem value="English">English</MenuItem>
								<MenuItem value="Frensh" disabled>
									Frensh
								</MenuItem>
								<MenuItem value="Arabic" disabled>
									Arabic
								</MenuItem>
							</Select>
							<FormHelperText>Select a language</FormHelperText>
						</FormControl>
					</div>
					<div className={classes.marginTopBottom}>
						<FormControl component="fieldset" className={classes.formControl}>
							<FormLabel component="legend">Difficulty</FormLabel>
							<RadioGroup
								aria-label="Difficulty"
								name="difficulty"
								className={classes.group}
								value={valueDifficulty}
								onChange={handleDifficultyChange}
							>
								<FormControlLabel value="Easy" control={<Radio />} label="Easy" />
								<FormControlLabel value="Medium" control={<Radio />} label="Medium" />
								<FormControlLabel value="Hard" control={<Radio />} label="Hard" />
							</RadioGroup>
						</FormControl>
					</div>
					<div className={classes.marginTopBottom}>
						<FormControlLabel
							value="Number of words"
							control={
								<Input
									name="number-of-words"
									type="number"
									inputProps={NumberOfWordsRange}
									value={numberOfWords}
									id="number-of-words"
									onChange={handleNumberOfWordsChange}
								/>
							}
							label="Number of words"
							labelPlacement="top"
						/>
						<Typography variant="caption" display="block" gutterBottom>
							Choose between {NumberOfWordsRange.min} and {NumberOfWordsRange.max} words
						</Typography>
					</div>
					<Button
						variant="contained"
						disabled={invalidNbrWordsInput}
						color="primary"
						onClick={startNewSession}
					>
						Start new session
					</Button>
				</React.Fragment>
			) : !isReady ? (
				'Preparing'
			) : (
				<Game
					alphabets={alphabets}
					difficulty={valueDifficulty}
					words={words}
					points={points}
					updateUserPoints={updateUserPoints}
					prepareNewSession={prepareNewSession}
					id={sessionId}
				/>
			)}
		</React.Fragment>
	);
};

export default GamePage;
