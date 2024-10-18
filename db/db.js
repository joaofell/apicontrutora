const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'construtora',
  user: 'postgres',
  password: 'j1o2a3o4',
});

module.exports = pool;
