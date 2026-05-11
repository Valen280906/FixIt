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
    await pool.query('ALTER TABLE users ALTER COLUMN avatar TYPE TEXT;');
    await pool.query('ALTER TABLE users ALTER COLUMN bio TYPE TEXT;');
    console.log('Columns altered successfully');
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
run();
