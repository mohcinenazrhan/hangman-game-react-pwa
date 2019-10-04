import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
	loaderFullPageCenter: {
		position: 'absolute',
		left: '50%',
		top: '50%',
		transform: 'translate(-50%, -50%)'
	},
	loaderNormal: {
		margin: '24px auto'
	}
}));

const SpinnerLoader = ({ fullPageCenter = false, message = null }) => {
	const classes = useStyles();

	return (
		<div className={clsx(fullPageCenter ? classes.loaderFullPageCenter : classes.loaderNormal)}>
			{message !== null && <p>{message}</p>}
			<CircularProgress />
		</div>
	);
};

export default SpinnerLoader;

SpinnerLoader.propTypes = {
	fullPageCenter: PropTypes.bool.isRequired,
	message: PropTypes.string.isRequired
};
