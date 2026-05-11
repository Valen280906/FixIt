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
    const queries = [
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS birth_date DATE;',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(50);',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS id_number VARCHAR(100);',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1) DEFAULT 5.0;',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS reviews INTEGER DEFAULT 0;',
      'ALTER TABLE users ALTER COLUMN avatar TYPE TEXT;',
      'ALTER TABLE users ALTER COLUMN bio TYPE TEXT;'
    ];
    for (let q of queries) {
      await pool.query(q);
    }
    console.log('All missing columns added successfully');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    pool.end();
  }
}
run();
