import React from 'react';
import {
	Typography,
	Button,
	FormControl,
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

	const [ valueLanguage, setValueLanguage ] = React.useState('english');

	function handleLanguageChange(event) {
		setValueLanguage(event.target.value);
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
			<Button onClick={() => changeCurrentPage('game')}>Start new session</Button>
		</React.Fragment>
	);
};

export default HomePage;
