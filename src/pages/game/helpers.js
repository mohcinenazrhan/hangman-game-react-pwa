// Helpers funcs
export const helpers = {
	// Return the appropriate alphabets according the language given
	getAlphabetsForLang: (language) => {
		let alphabets = 'abcdefghijklmnopqrstuvwxyz';
		if (language === 'Frensh') alphabets = 'abcdefghijklmnopqrstuvwxyzéèàçù';
		else if (language === 'Arabic') alphabets = 'يوهنملكقفغعظطضصشسزرذدخحجثتبأ';
		// Array alphabets letters
		return alphabets.toUpperCase().split('');
	},
	getWordInitialState: (wordToDiscoverArray) => {
		return wordToDiscoverArray.map((letter) => {
			return {
				letter: letter,
				state: 'hidden'
			};
		});
	},
	getAlphabetsInitialState: (alphabets) => {
		return alphabets.map((letter) => {
			return {
				letter: letter,
				disabled: false
			};
		});
	},
	getPointsToGain: (wordToDiscover, difficulty) => {
		// Default values for easy level
		let pointsToGain = wordToDiscover.length; // Initial Point is the length of the word to discover
		// Level of difficulty
		if (difficulty === 'Medium') {
			pointsToGain = wordToDiscover.length * 2;
		} else if (difficulty === 'Hard') {
			pointsToGain = wordToDiscover.length * 3;
		}
		return pointsToGain;
	},
	getNbrWrongGuessAllowed: (wordToDiscoverArray, difficulty) => {
		// Default values for easy level
		let guessAllowedRatio = 1; // Number to use to devide on to get nbr of wrong guess allowed
		// Level of difficulty
		if (difficulty === 'Medium') {
			guessAllowedRatio = 2;
		} else if (difficulty === 'Hard') {
			guessAllowedRatio = 3;
		}
		// Number of guess allowed
		// Dinstact the letters to count the number of tries allowed
		const dinstactLetters = wordToDiscoverArray.filter((item, i, ar) => ar.indexOf(item) === i);
		return Math.floor(dinstactLetters.length / guessAllowedRatio);
	},
	isCorrectGuess: (wordToDiscover, letter) => {
		return wordToDiscover.toUpperCase().indexOf(letter.toUpperCase()) === -1 ? false : true;
	},
	getUpdatedWordState: (wordState, letter) => {
		return wordState.map((row) => {
			if (letter === row.letter) row.state = 'found';
			return row;
		});
	},
	getUpdatedAlphabetsState: (alphabetsState, letter) => {
		return alphabetsState.map((row) => {
			if (letter === row.letter) row.disabled = true;
			return row;
		});
	},
	isWordFounded: (wordState) => {
		return wordState.length === wordState.filter((row) => row.state === 'found').length;
	},
	getShowedHiddenLettersWordState: (wordState) => {
		return wordState.map((row) => {
			if (row.state === 'hidden') row.state = 'show';
			return row;
		});
	},
	getHelpWordState: (wordState) => {
		const hiddenLetters = helpers.getWordStateHidden(wordState);
		const randLetter = hiddenLetters[Math.floor(Math.random() * hiddenLetters.length)];

		return helpers.getUpdatedWordState(wordState, randLetter.letter);
	},
	getWordStateHidden: (wordState) => {
		return wordState.filter((row) => row.state === 'hidden');
	},
	isGameWon: (newWordState) => {
		// Check if the user is successfully found the word
		return helpers.isWordFounded(newWordState);
	},
	isGameLosed: (newNbrWrongGuessState) => {
		return newNbrWrongGuessState < 0;
	},
	isGameEnded: (newNbrWrongGuessState, wordState, newCandidateLetter) => {
		return helpers.isGameWon(wordState, newCandidateLetter) || helpers.isGameLosed(newNbrWrongGuessState);
	},
	isSessionEnded: (words, gameNbr) => {
		// if this current word is the last one
		return words.length === gameNbr;
	},
	isHelpeEnded: (newWordState, newGainedPointsState) => {
		// Disable help btn if only one letter remains or the score is 1
		return helpers.getWordStateHidden(newWordState).length === 1 || newGainedPointsState === 1;
	}
};
