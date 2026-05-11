import express from 'express';
import pool from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware auth
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Crear nueva solicitud (Cliente)
router.post('/', authenticate, async (req, res) => {
  if (req.user.role !== 'client') return res.status(403).json({ error: 'Only clients can create requests' });
  
  const { service, description } = req.body;
  try {
    const newRequest = await pool.query(
      'INSERT INTO requests (client_id, service, description) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, service, description]
    );
    res.status(201).json(newRequest.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ver solicitudes (Si es técnico, ve activas. Si es cliente, ve las suyas)
router.get('/', authenticate, async (req, res) => {
  try {
    let requests;
    if (req.user.role === 'technician') {
      requests = await pool.query(`
        SELECT r.*, u.name as client_name 
        FROM requests r 
        JOIN users u ON r.client_id = u.id 
        WHERE r.status = 'active'
      `);
    } else {
      requests = await pool.query('SELECT * FROM requests WHERE client_id = $1', [req.user.id]);
    }
    res.json(requests.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
