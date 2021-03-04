require('dotenv').config();

const Pool = require('pg').Pool;

const pool = new Pool({
	user: 'postgres',
	password: '1234',
	host: 'localhost',
	port: '5432',
	database: 'gambling',
});

module.exports = pool;