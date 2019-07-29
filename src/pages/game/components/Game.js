import React, { useState } from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import progressDraw from '../../../assets/progress-draw.png';
import PropTypes from 'prop-types';
import SessionWordsStats from '../../common/SessionWordsStats';
import db from '../../../LocalDb';
import { useGameState } from './useGameState';
import { helpers } from './../helpers';

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
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3)
	},
	wordContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'center',
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3)
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
	}
}));

function Game({ id, words, alphabets, difficulty, updateUserPoints, prepareNewSession, resumeData = null }) {
	const classes = useStyles();
	// rgb color counter for color gradients
	// start by -1 to make it start at 0 since the counter step is by 1
	let cnt = -1;

	const {
		wordState,
		alphabetsState,
		nbrWrongGuessAllowed,
		nbrWrongGuessState,
		gameState,
		gameNbr,
		drawProgressState,
		pointsToGain,
		gainedPointsState,
		sessionScore,
		isSessionEnd,
		stats,
		disabledHelpBtnState,
		progressDrawFinalStep,
		setGameState,
		setNewGame
	} = useGameState(id, words, alphabets, difficulty, resumeData);

	// Show state
	const [ show, setShow ] = useState('game');

	function handleBtnClick(letter) {
		// Helper variables
		let isGameEnd = false,
			localDbActions = [];

		const newState = {
			wordState,
			alphabetsState,
			nbrWrongGuessAllowed,
			nbrWrongGuessState,
			gameState,
			gameNbr,
			drawProgressState,
			pointsToGain,
			gainedPointsState,
			sessionScore,
			isSessionEnd,
			stats,
			disabledHelpBtnState
		};

		if (helpers.isCorrectGuess(words[gameNbr - 1], letter)) {
			// Show the letter founded
			newState.wordState = helpers.getUpdatedWordState(wordState, letter);

			if (helpers.isGameWon(newState.wordState)) {
				isGameEnd = true;
				newState.gameState = 'succeed';
				console.log('Completed with successfully');
			}
		} else {
			// Remove one point from the score and wrong guess allowed and progress the hangman draw
			newState.nbrWrongGuessState = nbrWrongGuessState - 1;
			const newGainedPointsState = gainedPointsState > 1 ? gainedPointsState - 1 : gainedPointsState;
			newState.gainedPointsState = newGainedPointsState;
			const newDrawProgressState =
				drawProgressState + 1 < progressDrawFinalStep ? drawProgressState + 1 : drawProgressState;
			newState.drawProgressState = newDrawProgressState;

			if (helpers.isGameLosed(newState.nbrWrongGuessState)) {
				isGameEnd = true;
				newState.gameState = 'failed';
				newState.drawProgressState = progressDrawFinalStep;
				newState.wordState = helpers.getShowedHiddenLettersWordState(wordState);
				newState.nbrWrongGuessState = 0;
				newState.gainedPointsState = 0;
				console.log('Unfortunately, you failed');
			}
		}

		// Disable the clicked button
		const newAlphabetsState = helpers.getUpdatedAlphabetsState(alphabetsState, letter);
		newState.alphabetsState = newAlphabetsState;
		// Disable the helper btn if isHelpeEnded is true
		if (helpers.isHelpeEnded(newState.wordState, newState.gainedPointsState)) newState.disabledHelpBtnState = true;

		if (isGameEnd) {
			const updatedSessionScore = sessionScore + newState.gainedPointsState;
			const wordStats = {
				word: words[gameNbr - 1],
				result: newState.gameState,
				wordState: newState.wordState,
				score: newState.gainedPointsState,
				pointsToGain: pointsToGain,
				wrongGuessAllowed: nbrWrongGuessAllowed,
				misses: nbrWrongGuessAllowed - newState.nbrWrongGuessState
			};

			newState.sessionScore = updatedSessionScore;
			newState.stats = [ ...stats, wordStats ];

			localDbActions.push({
				action: 'updateSessionScore',
				data: {
					score: updatedSessionScore
				}
			});

			localDbActions.push({ action: 'addWordData', data: wordStats });

			if (helpers.isSessionEnded(words, gameNbr)) {
				newState.isSessionEnd = true;
				updateUserPoints(updatedSessionScore);
				localDbActions.push({ action: 'sessionEnded' });
			}

			updateLocalDb(localDbActions);
		}

		setGameState(newState);
	}

	function updateLocalDb(localDbActions) {
		try {
			const sessionsTable = db.table('sessions');

			sessionsTable.get(id, (object) => {
				let newObject = object;

				for (let obj of localDbActions) {
					if (obj.action === 'addWordData') {
						newObject = Object.assign({}, newObject, { playedWords: [ ...object.playedWords, obj.data ] });
					} else if (obj.action === 'updateSessionScore') {
						newObject = Object.assign({}, newObject, obj.data);
					} else if (obj.action === 'sessionEnded') {
						newObject = Object.assign({}, newObject, { ended: true });
					}
				}

				sessionsTable.update(id, newObject).then((updated) => {
					if (updated) console.log('Updated');
					else console.log('Nothing was updated');
				});
			});
		} catch (error) {
			console.log(error.message);
		}
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
		const newState = {};
		// Show random letter from the hidden ones
		newState.wordState = helpers.getHelpWordState(wordState);
		newState.gainedPointsState = gainedPointsState - 1;
		// Disable the helper btn if isHelpeEnded is true
		if (helpers.isHelpeEnded(newState.wordState, newState.gainedPointsState)) newState.disabledHelpBtnState = true;

		setGameState(newState);
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

	return (
		<React.Fragment>
			<div>
				<Typography>Session difficulty: {difficulty}</Typography>
				<Typography>Your session score: {sessionScore}</Typography>
				<Typography>
					{gameNbr}/{words.length} words
				</Typography>
			</div>
			<div className={classes.gameInfoContainer}>
				{gameState === 'playing' && (
					<React.Fragment>
						<Button
							variant="contained"
							disabled={disabledHelpBtnState}
							className={classes.button}
							onClick={handleHelpClick}
						>
							Get Help = -1 point
						</Button>
						<Typography>{`${pointsToGain} points to win`}</Typography>
						<Typography>{`You have ${nbrWrongGuessState} attempts (wrong)`}</Typography>
					</React.Fragment>
				)}
			</div>
			{show === 'game' && (
				<React.Fragment>
					<div className={classes.drawImgProgress} style={getProgressDraw()} />
					<div className={classes.wordContainer}>
						{wordState.map((row, index) => {
							cnt += 1;
							return (
								<div
									className={clsx(
										classes.wordLettres,
										row.state === 'show' && classes.notFoundedLetters
									)}
									style={{
										backgroundColor: `rgb(${224 - cnt}, ${224 - cnt}, ${224 - cnt})`,
										width: `${100 / wordState.length}%`
									}}
									key={index}
								>
									{row.state === 'hidden' ? '_' : row.letter}
								</div>
							);
						})}
					</div>
					{gameState === 'playing' && (
						<div>
							{alphabetsState.map((row, index) => {
								return (
									<Button
										key={index}
										variant="contained"
										color="secondary"
										className={classes.button}
										disabled={row.disabled}
										onClick={() => handleBtnClick(row.letter)}
									>
										{row.letter}
									</Button>
								);
							})}
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
						{!isSessionEnd && (
							<Button
								variant="contained"
								color="primary"
								className={classes.button}
								onClick={cancelSession}
							>
								Cancel
							</Button>
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
	prepareNewSession: PropTypes.func.isRequired,
	updateUserPoints: PropTypes.func.isRequired
};
