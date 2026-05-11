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
    const updated = await pool.query(
      `UPDATE users
       SET name=$1, phone=$2, address=$3, city=$4, bio=$5,
           avatar=$6, birth_date=$7, gender=$8, id_number=$9
       WHERE id=$10
       RETURNING *`,
      ['Andrea', '04123880437', 'Los Guayo', 'Valencia', 'bio',
       null, '2014-02-11', 'female', '31856233', 3]
    );
    console.log(updated.rows[0]);
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    pool.end();
  }
}
run();
