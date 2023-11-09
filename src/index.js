import React from 'react';
import ReactDOM from 'react-dom';
import AppProviders from './context';
import App from './app/App';
import * as serviceWorker from './pwa/serviceWorker';
import { inject } from '@vercel/analytics';

inject();

ReactDOM.render(
	<AppProviders>
		<App />
	</AppProviders>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
