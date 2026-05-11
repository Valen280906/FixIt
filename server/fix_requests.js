import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function run() {
  try {
    await pool.query('ALTER TABLE requests ADD COLUMN IF NOT EXISTS target_technician_id INTEGER REFERENCES users(id);');
    await pool.query('ALTER TABLE requests ADD COLUMN IF NOT EXISTS proposed_price NUMERIC(10, 2);');
    console.log('Requests table updated');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    pool.end();
  }
}
run();
