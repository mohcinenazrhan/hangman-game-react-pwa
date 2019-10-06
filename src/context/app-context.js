import React from 'react';

const AppStateContext = React.createContext();
const AppDispatchContext = React.createContext();

function appReducer(state, action) {
	switch (action.type) {
		case 'NAVIGATE_TO_PAGE': {
			return { ...state, page: action.page };
		}
		case 'MODE_GAME': {
			return { ...state, fullScreen: true };
		}
		case 'MODE_NAVIGATE': {
			return { ...state, fullScreen: false };
		}
		case 'ADD_POINTS': {
			return { ...state, points: action.pointsToAdd + state.points };
		}
		default: {
			throw new Error(`Unhandled action type: ${action.type}`);
		}
	}
}

function AppProvider({ children }) {
	const [ state, dispatch ] = React.useReducer(appReducer, {
		page: 'home',
		resumeSessionId: null,
		points:
			window.localStorage.getItem('userPoints') == null ? 0 : parseInt(window.localStorage.getItem('userPoints')),
		fullScreen: false
	});
	return (
		<AppStateContext.Provider value={state}>
			<AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
		</AppStateContext.Provider>
	);
}

function useAppDispatch() {
	const context = React.useContext(AppDispatchContext);
	if (context === undefined) {
		throw new Error(`useAppDispatch must be used within a AppProvider`);
	}
	return context;
}

function useAppState() {
	const context = React.useContext(AppStateContext);
	if (context === undefined) {
		throw new Error(`useAppState must be used within a AppProvider`);
	}
	return context;
}

export { AppProvider, useAppDispatch, useAppState };
