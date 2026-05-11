import pool from './db.js';

async function migrate() {
  try {
    // Add location columns to users table
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION,
      ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION,
      ADD COLUMN IF NOT EXISTS city VARCHAR(255)
    `);
    console.log('✅ Columnas lat, lng, city agregadas a users.');

    // Give test technician Caracas coordinates
    await pool.query(`
      UPDATE users SET lat = 10.4806, lng = -66.9036, city = 'Caracas' 
      WHERE email = 'tecnico@test.com'
    `);
    console.log('✅ Técnico de prueba actualizado con coordenadas de Caracas.');
  } catch (err) {
    console.error('❌ Error en migración:', err.message);
  } finally {
    await pool.end();
    console.log('Migración completada.');
  }
}

migrate();
