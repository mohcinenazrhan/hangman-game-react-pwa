import Dexie from 'dexie';

const db = new Dexie('sessionsDb');
db.version(1).stores({
	sessions: '++id,date,ended,score'
});

export default db;
