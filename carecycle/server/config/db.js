require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Function to execute SQL file
async function executeSqlFile(filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    await pool.query(sql);
    console.log(`Successfully executed SQL file: ${filePath}`);
  } catch (err) {
    console.error(`Error executing SQL file ${filePath}: ${err}`);
    throw err;
  }
}

// Function to initialize database schema
async function initializeDatabase() {
  try {
    await executeSqlFile(path.join(__dirname, '../db/create_tables.sql'));
    await executeSqlFile(path.join(__dirname, '../db/seed_data.sql'));
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
}

module.exports = {
  pool,
  initializeDatabase,
};
