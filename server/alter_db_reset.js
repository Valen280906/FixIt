import pool from './db.js';

async function alter() {
  try {
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_code VARCHAR(10);');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_expires TIMESTAMP;');
    console.log('Reset columns added successfully.');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

alter();
