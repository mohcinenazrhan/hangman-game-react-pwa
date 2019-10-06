import React, { useState } from 'react';
import { Button, makeStyles, Typography, IconButton, Collapse, Dialog, DialogTitle } from '@material-ui/core';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PauseIcon from '@material-ui/icons/Pause';
import progressDraw from '../assets/progress-draw.png';
import PropTypes from 'prop-types';
import SessionWordsStats from '../components/SessionWordsStats';
import { useGameState } from '../hooks/useGameState';
import Keyboard from '../components/Keyboard';
import Board from '../components/Board';
import { useAppDispatch } from '../context/app-context';

const useStyles = makeStyles((theme) => ({
	button: {
		fontWeight: 'bold'
	},
	keysContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		alignSelf: 'center',
		maxWidth: '500px',
		margin: '0 auto'
	},
	keyboardBtn: {
		fontWeight: 'bold',
		margin: theme.spacing(0.25, 0)
	},
	stickyBottomActionsContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-evenly',
		position: 'absolute',
		bottom: '10px',
		left: '50%',
		transform: 'translate(-50%,-50%)',
		maxWidth: '300px',
		width: '80%'
	},
	pauseBtn: {
		position: 'absolute',
		top: 0,
		right: 0
	},
	pauseDialog: {
		minWidth: '90%',
		textAlign: 'center',
		padding: '20px'
	},
	dialogActions: {
		padding: theme.spacing(3)
	},
	dialogActionsBtn: {
		width: '100%',
		marginBottom: theme.spacing(2),
		textTransform: 'none'
	},
	gameInfoContainer: {
		position: 'absolute',
		top: 0,
		left: '-10px',
		width: '70px',
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
	const dispatch = useAppDispatch();

	const {
		wordState,
		alphabetsState,
		nbrWrongGuessAllowed,
		nbrWrongGuessState,
		gameState,
		gameNbr,
		drawProgressState,
		gainedPointsState,
		pointsToGain,
		sessionScore,
		isSessionEnd,
		stats,
		disabledHelpBtnState,
		setNewGame,
		getHelp,
		setGuess,
		deleteSession
	} = useGameState(id, words, alphabets, difficulty, resumeData, updateUserPoints);

	// State to show either the game or its stats
	const [ show, setShow ] = useState('game');
	// State to open/close pause dialog
	const [ open, setOpen ] = React.useState(false);

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

	function saveSessionForLater() {
		dispatch({ type: 'QUIT_SAVE_SESSION' });
	}

	function deleteAndCancelSession() {
		deleteSession();
		prepareNewSession();
	}

	const [ expanded, setExpanded ] = React.useState(false);

	function handleExpandClick() {
		setExpanded(!expanded);
	}

	function pauseTheGame() {
		setOpen(true);
	}

	function handleClose() {
		setOpen(false);
	}

	return (
		<React.Fragment>
			{!isSessionEnd && (
				<React.Fragment>
					<IconButton className={classes.pauseBtn} aria-label="pause" onClick={pauseTheGame}>
						<PauseIcon />
					</IconButton>

					<Dialog
						onClose={handleClose}
						aria-labelledby="simple-dialog-title"
						open={open}
						className={classes.pauseDialog}
					>
						<DialogTitle id="simple-dialog-title">Paused</DialogTitle>
						<div className={classes.dialogActions}>
							<Button
								variant="contained"
								color="primary"
								size="large"
								className={classes.dialogActionsBtn}
								onClick={handleClose}
							>
								Resume
							</Button>
							<Button
								variant="contained"
								color="primary"
								size="large"
								className={classes.dialogActionsBtn}
								onClick={saveSessionForLater}
							>
								Save it for later
							</Button>
							<Button
								variant="contained"
								color="primary"
								size="large"
								className={classes.dialogActionsBtn}
								onClick={deleteAndCancelSession}
							>
								Unsave and Cancel
							</Button>
						</div>
					</Dialog>
				</React.Fragment>
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
							<React.Fragment>
								<Typography
									className={classes.textBold}
								>{`${gainedPointsState}/${pointsToGain} Points`}</Typography>
								<br />
								<Typography className={classes.textBold}>{`${nbrWrongGuessAllowed -
									nbrWrongGuessState}/${nbrWrongGuessAllowed} Guesses`}</Typography>
							</React.Fragment>
						</div>
					</div>
					<div className={classes.wordContainer}>
						<Board
							wordState={wordState}
							classes={{ wordLettres: classes.wordLettres, notFoundedLetters: classes.notFoundedLetters }}
						/>
					</div>
					{gameState === 'playing' && (
						<div className={classes.keysContainer}>
							<Keyboard
								alphabets={alphabetsState}
								btnStyle={classes.keyboardBtn}
								keyboardLetterClick={handleKeyboardLetterClick}
							/>
							<Button
								variant="contained"
								disabled={disabledHelpBtnState}
								className={classes.keyboardBtn}
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
										`Great, you've found the word successfully, you win`
									) : (
										`Unfortunately, you lose, the word was: ${words[gameNbr - 1]}`
									)}
								</Typography>
								{!isSessionEnd && (
									<div className={classes.stickyBottomActionsContainer}>
										<Button
											variant="contained"
											color="primary"
											className={classes.button}
											onClick={newGame}
										>
											NEXT WORD
										</Button>
									</div>
								)}
							</React.Fragment>
						)}
						{isSessionEnd && (
							<div className={classes.stickyBottomActionsContainer}>
								<Button
									variant="contained"
									color="primary"
									className={classes.button}
									onClick={newSession}
								>
									New session
								</Button>
								<Button
									variant="contained"
									color="primary"
									className={classes.button}
									onClick={sessionstats}
								>
									Show stats
								</Button>
							</div>
						)}
					</div>
				</React.Fragment>
			)}
			{show === 'stats' && (
				<React.Fragment>
					<Typography>My session stats</Typography>
					<SessionWordsStats stats={stats} />
					<div className={classes.stickyBottomActionsContainer}>
						<Button variant="contained" color="primary" className={classes.button} onClick={newSession}>
							Go for another session
						</Button>
					</div>
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
