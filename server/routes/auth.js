import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();

// ─── Auth middleware ───────────────────────────────────────────────────────
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// ─── Register ─────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password, role, city, lat, lng } = req.body;
  try {
    const exists = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (exists.rows.length > 0)
      return res.status(400).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, await bcrypt.genSalt(10));

    const newUser = await pool.query(
      `INSERT INTO users (name, email, password, role, city, lat, lng)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING id, name, email, role, city`,
      [name, email, hashed, role || 'client', city || null, lat || null, lng || null]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Login ────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (result.rows.length === 0)
      return res.status(400).json({ error: 'Credenciales inválidas' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, city: user.city }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Get profile ──────────────────────────────────────────────────────────
router.get('/profile', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, phone, address, city, bio, lat, lng, avatar, birth_date, gender, id_number FROM users WHERE id=$1',
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Update profile ───────────────────────────────────────────────────────
router.put('/profile', authenticate, async (req, res) => {
  const { name, phone, address, city, bio, avatar, birth_date, gender, id_number } = req.body;
  try {
    const updated = await pool.query(
      `UPDATE users
       SET name=$1, phone=$2, address=$3, city=$4, bio=$5,
           avatar=$6, birth_date=$7, gender=$8, id_number=$9
       WHERE id=$10
       RETURNING id, name, email, role, phone, address, city, bio, avatar, birth_date, gender, id_number`,
      [name, phone||null, address||null, city||null, bio||null,
       avatar||null, birth_date||null, gender||null, id_number||null, req.user.id]
    );
    res.json(updated.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
