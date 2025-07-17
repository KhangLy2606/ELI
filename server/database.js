// ELI/server/database.js
// Initializes and exports the PostgreSQL connection pool.

const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool(config.db);

module.exports = pool;
