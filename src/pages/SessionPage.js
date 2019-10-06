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
import GamePage from './GamePage';
import { usePrepGameState } from '../hooks/usePrepGameState';
import SpinnerLoader from '../components/SpinnerLoader';
import { useAppDispatch } from '../context/app-context';

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

const SessionPage = ({ updatePoints }) => {
	const classes = useStyles();
	const dispatch = useAppDispatch();

	const NumberOfWordsRange = {
		min: '1',
		max: '15'
	};

	const [ invalidNbrWordsInput, setInvalidNbrWordsInput ] = React.useState(false);

	const {
		newSession,
		sessionId,
		numberOfWords,
		valueLanguage,
		valueDifficulty,
		alphabets,
		words,
		isReady,
		setValueLanguage,
		setValueDifficulty,
		setNumberOfWords,
		setNewSession
	} = usePrepGameState('newSession');

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
		updatePoints(newPoints);
	}

	function startNewSession() {
		setNewSession(true);
		dispatch({ type: 'MODE_GAME' });
	}

	function prepareNewSession() {
		setNewSession(false);
		dispatch({ type: 'MODE_NAVIGATE' });
	}

	function quitSession() {
		dispatch({ type: 'NAVIGATE_TO_PAGE', page: 'home' });
		dispatch({ type: 'MODE_NAVIGATE' });
	}

	return (
		<React.Fragment>
			{newSession === false ? (
				<React.Fragment>
					<Typography variant="h5" component="h1">
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
				<SpinnerLoader message="Preparing the Game" fullPageCenter={true} />
			) : (
				<GamePage
					alphabets={alphabets}
					difficulty={valueDifficulty}
					language={valueLanguage}
					words={words}
					updateUserPoints={updateUserPoints}
					prepareNewSession={prepareNewSession}
					id={sessionId}
					quitSession={quitSession}
				/>
			)}
		</React.Fragment>
	);
};

export default SessionPage;
