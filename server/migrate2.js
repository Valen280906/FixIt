import pool from './db.js';

async function migrate2() {
  try {
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
      ADD COLUMN IF NOT EXISTS address TEXT,
      ADD COLUMN IF NOT EXISTS bio TEXT
    `);
    console.log('✅ Columnas phone, address, bio agregadas a users.');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
    console.log('Migración 2 completada.');
  }
}

migrate2();
