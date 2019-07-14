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

const HomePage = ({ changeCurrentPage }) => {
	const classes = useStyles();
	const NumberOfWordsRange = {
		min: '1',
		max: '15'
	};

	const [ valueLanguage, setValueLanguage ] = React.useState('english');
	const [ valueDifficulty, setValueDifficulty ] = React.useState('Easy');
	const [ numberOfWords, setNumberOfWords ] = React.useState(5);

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

	return (
		<React.Fragment>
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
						<MenuItem value="english">English</MenuItem>
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
			<Button onClick={() => changeCurrentPage('game')}>Start new session</Button>
		</React.Fragment>
	);
};

export default HomePage;
