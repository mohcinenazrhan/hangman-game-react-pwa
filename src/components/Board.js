import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const Board = ({ wordState, classes }) => {
	// rgb color counter for color gradients
	// start by -1 to make it start at 0 since the counter step is by 1
	let cnt = -1;

	return (
		<React.Fragment>
			{wordState.map((row, index) => {
				cnt += 1;
				return (
					<div
						className={clsx(classes.wordLettres, row.state === 'show' && classes.notFoundedLetters)}
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
		</React.Fragment>
	);
};

export default Board;

Board.propTypes = {
	wordState: PropTypes.array.isRequired,
	classes: PropTypes.object.isRequired
};
