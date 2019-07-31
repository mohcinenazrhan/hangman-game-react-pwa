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
	}
};

export default LocalDb;
