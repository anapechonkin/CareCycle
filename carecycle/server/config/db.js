const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'carecycle',
  password: 'Purell258', 
  port: 5432,
});

module.exports = pool;
