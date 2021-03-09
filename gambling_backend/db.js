require('dotenv').config();

const Pool = require('pg').Pool;

const pool = new Pool({
	user: 'postgres',
	password: '1234',
	host: 'localhost',
	port: '5432',
	database: 'gambling',
});
pool.on('connect', () => {
	console.log('connected to the Database');
});

module.exports = pool;
