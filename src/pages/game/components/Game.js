import React, { useState } from 'react';
import { Button, makeStyles, Typography, IconButton, Collapse } from '@material-ui/core';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import progressDraw from '../../../assets/progress-draw.png';
import PropTypes from 'prop-types';
import SessionWordsStats from '../../common/SessionWordsStats';
import { useGameState } from './useGameState';
import Keyboard from './Keyboard';
import Board from './Board';

const useStyles = makeStyles((theme) => ({
	button: {
		margin: theme.spacing(0.5),
		padding: 0,
		fontWeight: 'bold',
		[theme.breakpoints.up('sm')]: {
			margin: theme.spacing(1),
			padding: '6px 16px'
		}
	},
	gameInfoContainer: {
		position: 'absolute',
		top: 0,
		left: '-40px',
		width: '100px',
		fontSize: '16px',
		fontWeight: 'bold'
	},
	wordContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'center',
		margin: theme.spacing(1, 0)
	},
	sessionInfosContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	expand: {
		transform: 'rotate(0deg)',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest
		})
	},
	expandOpen: {
		transform: 'rotate(180deg)'
	},
	wordLettres: {
		height: 60,
		maxWidth: 60,
		minWidth: 30,
		lineHeight: '60px',
		fontSize: 18,
		color: '#000',
		textAlign: 'center',
		marginBottom: 5
	},
	notFoundedLetters: {
		color: '#bc000f'
	},
	drawImgProgress: {
		background: `url(${progressDraw})`,
		position: 'relative',
		width: 208,
		height: 130,
		margin: '0 auto',
		transition: theme.transitions.create('background', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	hide: {
		display: 'none'
	},
	textBold: {
		fontWeight: 'bold'
	}
}));

function Game({ id, words, alphabets, language, difficulty, updateUserPoints, prepareNewSession, resumeData = null }) {
	const classes = useStyles();

	const {
		wordState,
		alphabetsState,
		nbrWrongGuessAllowed,
		nbrWrongGuessState,
		gameState,
		gameNbr,
		drawProgressState,
		gainedPointsState,
		sessionScore,
		isSessionEnd,
		stats,
		disabledHelpBtnState,
		setNewGame,
		getHelp,
		setGuess
	} = useGameState(id, words, alphabets, difficulty, resumeData, updateUserPoints);

	// State to show either the game or its stats
	const [ show, setShow ] = useState('game');

	function handleKeyboardLetterClick(letter) {
		setGuess(letter);
	}

	function getProgressDraw() {
		return {
			backgroundPosition: `${drawProgressState * -200}px`
		};
	}

	function newGame() {
		setNewGame();
	}

	function handleHelpClick() {
		getHelp();
	}

	function newSession() {
		prepareNewSession();
	}

	function sessionstats() {
		setShow('stats');
	}

	function cancelSession() {
		prepareNewSession();
	}
	const [ expanded, setExpanded ] = React.useState(false);

	function handleExpandClick() {
		setExpanded(!expanded);
	}

	return (
		<React.Fragment>
			{!isSessionEnd && (
				<Button variant="contained" color="primary" className={classes.button} onClick={cancelSession}>
					Cancel
				</Button>
			)}
			<div>
				<div className={classes.sessionInfosContainer}>
					<Typography>{`Session N°${id}`}</Typography>
					<IconButton
						className={clsx(classes.expand, {
							[classes.expandOpen]: expanded
						})}
						onClick={handleExpandClick}
						aria-expanded={expanded}
						aria-label="show words stats"
					>
						<ExpandMoreIcon />
					</IconButton>
				</div>
				<Collapse in={expanded} timeout="auto" unmountOnExit>
					<Typography>{`${language}, ${difficulty}, ${sessionScore} Points`}</Typography>
				</Collapse>
				<Typography>
					{gameNbr}/{words.length} words
				</Typography>
			</div>
			{show === 'game' && (
				<React.Fragment>
					<div className={classes.drawImgProgress} style={getProgressDraw()}>
						<div className={classes.gameInfoContainer}>
							{gameState === 'playing' && (
								<React.Fragment>
									<Typography
										className={classes.textBold}
									>{`${gainedPointsState} points to win`}</Typography>
									<br />
									<Typography
										className={classes.textBold}
									>{`${nbrWrongGuessState} guesses left`}</Typography>
								</React.Fragment>
							)}
						</div>
					</div>
					<div className={classes.wordContainer}>
						<Board
							wordState={wordState}
							classes={{ wordLettres: classes.wordLettres, notFoundedLetters: classes.notFoundedLetters }}
						/>
					</div>
					{gameState === 'playing' && (
						<div>
							<Keyboard
								alphabets={alphabetsState}
								btnStyle={classes.button}
								keyboardLetterClick={handleKeyboardLetterClick}
							/>
							<Button
								variant="contained"
								disabled={disabledHelpBtnState}
								className={classes.button}
								onClick={handleHelpClick}
							>
								Help = -1 point
							</Button>
						</div>
					)}
					<div>
						{gameState !== 'playing' && (
							<React.Fragment>
								<Typography>
									{gameState === 'succeed' ? (
										`Great, you've found the word successfully, you win ${gainedPointsState} points, with ${nbrWrongGuessAllowed -
											nbrWrongGuessState}/${nbrWrongGuessAllowed} wrong attempts`
									) : (
										`Unfortunately, you lose, the word was: ${words[
											gameNbr - 1
										]}, you had ${gainedPointsState} points, with ${nbrWrongGuessAllowed -
											nbrWrongGuessState} wrong attempts`
									)}
								</Typography>
								{!isSessionEnd && (
									<Button
										variant="contained"
										color="primary"
										className={classes.button}
										onClick={newGame}
									>
										NEXT WORD
									</Button>
								)}
							</React.Fragment>
						)}
						{isSessionEnd && (
							<React.Fragment>
								<Typography>The session is end</Typography>
								<Button
									variant="contained"
									color="primary"
									className={classes.button}
									onClick={sessionstats}
								>
									Show my session stats
								</Button>
								<Button
									variant="contained"
									color="primary"
									className={classes.button}
									onClick={newSession}
								>
									Go for another session
								</Button>
							</React.Fragment>
						)}
					</div>
				</React.Fragment>
			)}
			{show === 'stats' && (
				<React.Fragment>
					<Typography>My session stats</Typography>
					<SessionWordsStats stats={stats} />
					<Button variant="contained" color="primary" className={classes.button} onClick={newSession}>
						Go for another session
					</Button>
				</React.Fragment>
			)}
		</React.Fragment>
	);
}

export default Game;

Game.propTypes = {
	id: PropTypes.number.isRequired,
	words: PropTypes.array.isRequired,
	alphabets: PropTypes.array.isRequired,
	difficulty: PropTypes.string.isRequired,
	language: PropTypes.string.isRequired,
	prepareNewSession: PropTypes.func.isRequired,
	updateUserPoints: PropTypes.func.isRequired
};
