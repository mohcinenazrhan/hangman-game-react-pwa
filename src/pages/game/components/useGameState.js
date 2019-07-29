import { useEffect, useReducer } from 'react';
import { helpers } from './../helpers';

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
			return {
				...state,
				...{
					wordState: wordInitialState,
					alphabetsState: alphabetsInitialState,
					nbrWrongGuessAllowed: nbrWrongGuessAllowedInitialState,
					nbrWrongGuessState: nbrWrongGuessAllowedInitialState,
					pointsToGain: pointsToGainInitialState,
					gainedPointsState: pointsToGainInitialState
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
export const useGameState = (id, words, alphabets, difficulty, resumeData) => {
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

	return {
		getHelp,
		setNewGame,
		setGameState,
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
		progressDrawFinalStep
	};
};
