import Dexie from 'dexie';

const LocalDb = {
	getDb: () => {
		const newDb = new Dexie('sessionsDb');
		newDb.version(1).stores({
			sessions: '++id,date,ended,score'
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
				ended: false,
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
	}
};

export default LocalDb;
