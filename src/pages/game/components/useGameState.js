import { useEffect, useReducer } from 'react';
import { helpers } from './../helpers';
import LocalDb from '../../../LocalDb';

function gameReducer(state, action) {
	switch (action.type) {
		case 'NEW_GAME': {
			return {
				...state,
				gameState: 'playing',
				nbrWrongGuessState: 0,
				nbrWrongGuessAllowed: 0,
				gainedPointsState: 0,
				pointsToGain: 0,
				pointsReductionRate: 0,
				alphabetsState: [],
				wordState: [],
				gameNbr: state.gameNbr + 1,
				drawProgress: 0,
				disabledHelpBtnState: false
			};
		}
		case 'PREPARE_NEW_GAME': {
			const { words, alphabets, difficulty } = action.params;
			const wordToDiscover = words[state.gameNbr - 1];
			const wordToDiscoverArray = wordToDiscover.toUpperCase().split('');
			const wordInitialState = helpers.getWordInitialState(wordToDiscoverArray);
			const alphabetsInitialState = helpers.getAlphabetsInitialState(alphabets);
			const pointsToGainInitialState = helpers.getPointsToGain(wordToDiscoverArray, difficulty);
			const nbrWrongGuessAllowedInitialState = helpers.getNbrWrongGuessAllowed(wordToDiscoverArray, difficulty);
			const pointsReductionRateInitialState = pointsToGainInitialState / nbrWrongGuessAllowedInitialState;
			return {
				...state,
				...{
					wordState: wordInitialState,
					alphabetsState: alphabetsInitialState,
					nbrWrongGuessAllowed: nbrWrongGuessAllowedInitialState,
					nbrWrongGuessState: nbrWrongGuessAllowedInitialState,
					pointsToGain: pointsToGainInitialState,
					gainedPointsState: pointsToGainInitialState,
					pointsReductionRate: pointsReductionRateInitialState
				}
			};
		}
		case 'UPDATE_GAME': {
			return {
				...state,
				...action.newState
			};
		}
		case 'GET_HELP': {
			// Show random letter from the hidden ones
			const newWordState = helpers.getHelpWordState(state.wordState);
			const newGainedPointsState = state.gainedPointsState - 1;
			// Disable the helper btn if isHelpeEnded is true
			const newDisabledHelpBtnState = helpers.isHelpeEnded(newWordState, newGainedPointsState);
			return {
				...state,
				...{
					wordState: newWordState,
					gainedPointsState: newGainedPointsState,
					disabledHelpBtnState: newDisabledHelpBtnState
				}
			};
		}
		default:
			return state;
	}
}

// Custom hook handle the game
export const useGameState = (id, words, alphabets, difficulty, resumeData, updateUserPoints) => {
	// Draw progress game
	const progressDrawStartStep = 0;
	const progressDrawFinalStep = 6;

	const initialState = {
		wordState: [],
		alphabetsState: [],
		nbrWrongGuessState: 0,
		nbrWrongGuessAllowed: 0,
		gameState: 'playing',
		gameNbr: resumeData !== null ? resumeData.playedWords.length + 1 : 1,
		drawProgressState: progressDrawStartStep,
		gainedPointsState: 0,
		pointsToGain: 0,
		pointsReductionRate: 0,
		sessionScore: resumeData !== null ? resumeData.score : 0,
		isSessionEnd: false,
		stats: resumeData !== null ? resumeData.playedWords : [],
		disabledHelpBtnState: false
	};

	const [ state, dispatch ] = useReducer(gameReducer, initialState);
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
		pointsReductionRate,
		sessionScore,
		isSessionEnd,
		stats,
		disabledHelpBtnState
	} = state;

	useEffect(
		() => {
			// Check if all the wolds are used
			if (isSessionEnd) {
				console.log('The words end');
				return;
			}

			/* The logic that has to run once a game */
			dispatch({
				type: 'PREPARE_NEW_GAME',
				params: { words, alphabets, difficulty }
			});
		},
		[ alphabets, difficulty, gameNbr, isSessionEnd, words ]
	);

	const setNewGame = () => {
		dispatch({ type: 'NEW_GAME' });
	};

	const setGameState = (newState) => {
		dispatch({
			type: 'UPDATE_GAME',
			newState
		});
	};

	const getHelp = () => {
		dispatch({
			type: 'GET_HELP'
		});
	};

	const deleteSession = () => {
		dispatch({
			type: 'RESET_SESSION',
			newSate: initialState
		});
		LocalDb.deleteSession(id);
	};

	const setGuess = (letter) => {
		// Helper variables
		let isGameEnd = false;

		const newState = { ...state };

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
			const newGainedPointsState =
				gainedPointsState > 1 ? gainedPointsState - pointsReductionRate : gainedPointsState;
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

			if (helpers.isSessionEnded(words, gameNbr)) {
				newState.isSessionEnd = true;
				updateUserPoints(updatedSessionScore);
			}

			LocalDb.updateLocalDb(id, {
				score: updatedSessionScore,
				playedWords: newState.stats,
				state: newState.isSessionEnd ? 'Completed' : 'Uncompleted'
			});
		}

		setGameState(newState);
	};

	return {
		deleteSession,
		wordState,
		pointsToGain,
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
	};
};
