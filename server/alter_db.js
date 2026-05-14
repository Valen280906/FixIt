import pool from './db.js';

async function alter() {
  try {
    await pool.query('ALTER TABLE requests ADD COLUMN IF NOT EXISTS tech_message TEXT;');
    console.log('Column added successfully.');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

alter();
