import fetch from 'node-fetch';
import pkg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
const { Pool } = pkg;
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
    const hashed = await bcrypt.hash('password', 10);
    await pool.query("UPDATE users SET password=$1 WHERE email='andrea.c.a.808@gmail.com'", [hashed]);
    
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'andrea.c.a.808@gmail.com', password: 'password' })
    });
    const data = await loginRes.json();
    
    const putRes = await fetch('http://localhost:5000/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.token}` },
      body: JSON.stringify({
        name: 'Andrea Test',
        phone: '04123880437',
        address: 'Los Guayo',
        city: 'Valencia',
        bio: 'test bio',
        avatar: '',
        birth_date: '2014-02-11',
        gender: 'female',
        id_number: '123456'
      })
    });
    console.log('PUT response:', await putRes.json());
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
run();
