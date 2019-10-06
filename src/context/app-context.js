import React from 'react';

const AppStateContext = React.createContext();
const AppDispatchContext = React.createContext();

function appReducer(initState, action) {
	switch (action.type) {
		case 'NAVIGATE_TO_PAGE': {
			return { ...initState, page: action.page };
		}
		case 'MODE_GAME': {
			return { ...initState, fullScreen: true };
		}
		case 'MODE_NAVIGATE': {
			return { ...initState, fullScreen: false };
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
		points: 0,
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
