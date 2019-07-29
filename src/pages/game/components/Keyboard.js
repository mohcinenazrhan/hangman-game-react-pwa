import React from 'react';
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';

const Keyboard = ({ alphabets, btnStyle, keyboardLetterClick }) => {
	return (
		<React.Fragment>
			{alphabets.map((row, index) => {
				return (
					<Button
						key={index}
						variant="contained"
						color="secondary"
						className={btnStyle}
						disabled={row.disabled}
						onClick={() => keyboardLetterClick(row.letter)}
					>
						{row.letter}
					</Button>
				);
			})}
		</React.Fragment>
	);
};

export default Keyboard;

Keyboard.propTypes = {
	alphabets: PropTypes.array.isRequired,
	btnStyle: PropTypes.string.isRequired,
	keyboardLetterClick: PropTypes.func.isRequired
};
