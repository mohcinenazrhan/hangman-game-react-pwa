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
import Game from '../Game';

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

const HomePage = () => {
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

	// State for the dependencies if ready
	const [ isReady, setIsReady ] = React.useState(false);

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

				// Set the appropriate alphabets according the language selected
				let alphabets = 'abcdefghijklmnopqrstuvwxyz';
				if (valueLanguage === 'Frensh') alphabets = 'abcdefghijklmnopqrstuvwxyzéèàçù';
				else if (valueLanguage === 'Arabic') alphabets = 'يوهنملكقفغعظطضصشسزرذدخحجثتبأ';
				// Array alphabets letters
				const alphabetsArray = alphabets.toUpperCase().split('');

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

				setWords(sessionWords.slice(0, numberOfWords));
				setAlphabets(alphabetsArray);
				setIsReady(true);
			}
		},
		[ newSession, valueLanguage, valueDifficulty, numberOfWords ]
	);

	function handleLanguageChange(event) {
		setValueLanguage(event.target.value);
	}

	function handleDifficultyChange(event) {
		setValueDifficulty(event.target.value);
	}

	function handleNumberOfWordsChange(event) {
		if (
			parseInt(event.target.value) >= parseInt(NumberOfWordsRange.min) &&
			parseInt(event.target.value) <= parseInt(NumberOfWordsRange.max)
		)
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
								<MenuItem value="Frensh">Frensh</MenuItem>
								<MenuItem value="Arabic">Arabic</MenuItem>
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
					<Button variant="contained" color="primary" onClick={startNewSession}>
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
				/>
			)}
		</React.Fragment>
	);
};

export default HomePage;
