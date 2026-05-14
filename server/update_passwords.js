import bcrypt from 'bcrypt';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function run() {
  try {
    const users = await pool.query('SELECT id, email, role FROM users');
    console.log(`Found ${users.rows.length} users.`);

    for (const u of users.rows) {
      let newPass = 'Cliente2024!';
      if (u.role === 'technician') {
        newPass = 'Tecnico2024!';
      } else if (u.role === 'admin') {
        newPass = 'Admin2024!';
      }
      const hashed = await bcrypt.hash(newPass, 10);
      await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, u.id]);
      console.log(`Updated password for ${u.email} (${u.role}) to ${newPass}`);
    }
    console.log('Finished updating passwords.');
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

run();
