import pool from './db.js';

async function clearJobs() {
  try {
    await pool.query('TRUNCATE TABLE requests CASCADE;');
    console.log('All jobs have been successfully deleted.');
  } catch (err) {
    console.error('Error deleting jobs:', err);
  } finally {
    process.exit(0);
  }
}

clearJobs();
