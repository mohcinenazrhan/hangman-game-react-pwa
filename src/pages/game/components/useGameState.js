import { useEffect, useReducer } from 'react';
import { helpers } from './../helpers';

function gameReducer(state, action) {
	switch (action.type) {
		case 'newGame': {
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
				helpBtnState: false
			};
		}
		case 'prepareGame': {
			return {
				...state,
				...action.newState
			};
		}
		case 'updateGameState': {
			return {
				...state,
				...action.newState
			};
		}
		case 'gameEnded': {
			return {
				...state,
				...action.newState
			};
		}
		case 'saveGame': {
			return {
				...state,
				stats: [ ...state.stats, action.newStats ]
			};
		}
		case 'sessionEnded': {
			return {
				...state,
				isSessionEnd: true
			};
		}
		case 'guessResult': {
			return {
				...state,
				...action.newState
			};
		}
		case 'getHelp': {
			return {
				...state,
				...action.newState
			};
		}
		case 'disableHelp': {
			return {
				...state,
				helpBtnState: true
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
			const wordToDiscover = words[gameNbr - 1];
			const wordToDiscoverArray = wordToDiscover.toUpperCase().split('');
			const wordInitialState = helpers.getWordInitialState(wordToDiscoverArray);
			const alphabetsInitialState = helpers.getAlphabetsInitialState(alphabets);
			const pointsToGainInitialState = helpers.getPointsToGain(wordToDiscoverArray, difficulty);
			const nbrWrongGuessAllowedInitialState = helpers.getNbrWrongGuessAllowed(wordToDiscoverArray, difficulty);

			dispatch({
				type: 'prepareGame',
				newState: {
					wordState: wordInitialState,
					alphabetsState: alphabetsInitialState,
					nbrWrongGuessAllowed: nbrWrongGuessAllowedInitialState,
					nbrWrongGuessState: nbrWrongGuessAllowedInitialState,
					pointsToGain: pointsToGainInitialState,
					gainedPointsState: pointsToGainInitialState
				}
			});
		},
		[ alphabets, difficulty, gameNbr, isSessionEnd, words ]
	);

	const setNewGame = () => {
		dispatch({ type: 'newGame' });
	};

	const setGameState = (newState) => {
		dispatch({
			type: 'updateGameState',
			newState
		});
	};

	return {
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
