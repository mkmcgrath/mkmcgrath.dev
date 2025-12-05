const { Pool } = require('pg');
require('dotenv').config({ path: __dirname + '/../.env' });

// create  a connection pool to PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// test the connection
pool.on('connect', () => {
  console.log("connected to postgreSQL database");
});

pool.on('error', (err) => {
  console.error('unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
