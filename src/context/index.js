import React from 'react';
import { AppProvider } from './app-context';

function AppProviders({ children }) {
	return <AppProvider>{children}</AppProvider>;
}

export default AppProviders;
