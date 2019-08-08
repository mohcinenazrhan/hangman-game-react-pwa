import Dexie from 'dexie';

const LocalDb = {
	getDb: () => {
		const newDb = new Dexie('sessionsDb');
		newDb.version(1).stores({
			sessions: '++id,date,state'
		});
		return newDb;
	},

	updateLocalDb: (id, updatedData) => {
		try {
			const sessionsTable = LocalDb.getDb().table('sessions');
			sessionsTable.get(id, (object) => {
				const newObject = Object.assign({}, object, updatedData);
				sessionsTable.update(id, newObject).then((updated) => {
					if (updated) console.log('Local Db updated, session Num', id);
					else console.log('Nothing was updated');
				});
			});
		} catch (error) {
			console.log(error.message);
		}
	},
	createNewSession: (wordsList, language, difficulty) => {
		try {
			return LocalDb.getDb().table('sessions').add({
				date: new Date(),
				state: 'Uncompleted',
				score: 0,
				words: wordsList,
				language: language,
				difficulty: difficulty,
				playedWords: []
			});
		} catch (error) {
			console.log(error.message);
		}
	},
	getSession: (id) => {
		try {
			return LocalDb.getDb().table('sessions').get(id, (object) => {
				return Promise.resolve(object);
			});
		} catch (error) {
			console.log(error.message);
		}
	},
	getLastSessions: (sessionState = 'All', nbr = null) => {
		try {
			let query = LocalDb.getDb().table('sessions');

			if (sessionState === 'All') query = query.orderBy('date');
			else query = query.where('state').equals(sessionState);

			query = query.reverse();

			if (nbr !== null) query = query.limit(nbr);

			return query.toArray((rows) => {
				return Promise.resolve(rows);
			});
		} catch (error) {
			console.log(error.message);
		}
	},
	getLastUncompletedSessions: (nbr) => {
		try {
			return LocalDb.getDb()
				.table('sessions')
				.where('state')
				.equals('Uncompleted')
				.reverse()
				.limit(nbr)
				.toArray((rows) => {
					return Promise.resolve(rows);
				});
		} catch (error) {
			console.log(error.message);
		}
	},
	getNbrSessionsCompleted: () => {
		try {
			return LocalDb.getDb().table('sessions').where('state').equals('Completed').count((value) => {
				return Promise.resolve(value);
			});
		} catch (error) {
			console.log(error.message);
		}
	},
	getNbrWordGuessedSuccessfully: () => {
		try {
			return LocalDb.getDb().table('sessions').toArray((sessions) => {
				let counter = 0;
				for (const session of sessions) {
					counter = counter + session.playedWords.filter((word) => word.result === 'succeed').length;
				}
				return Promise.resolve(counter);
			});
		} catch (error) {
			console.log(error.message);
		}
	},
	deleteSession: (id) => {
		try {
			return LocalDb.getDb().table('sessions').delete(id);
		} catch (error) {
			console.log(error.message);
		}
	},
	itHasRecords: () => {
		try {
			return LocalDb.getDb().table('sessions').count((value) => {
				return Promise.resolve(value > 0 ? true : false);
			});
		} catch (error) {
			console.log(error.message);
		}
	}
};

export default LocalDb;
