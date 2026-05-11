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
  
  const { service, description, target_technician_id, proposed_price } = req.body;
  try {
    const newRequest = await pool.query(
      'INSERT INTO requests (client_id, service, description, target_technician_id, proposed_price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, service, description, target_technician_id || null, proposed_price || null]
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
        SELECT r.*, u.name as client_name, u.city as client_city, u.avatar as client_avatar
        FROM requests r 
        JOIN users u ON r.client_id = u.id 
        WHERE 
          (r.status = 'active' AND (r.target_technician_id = $1 OR r.target_technician_id IS NULL))
          OR
          (r.status != 'active' AND r.target_technician_id = $1)
        ORDER BY r.created_at DESC
      `, [req.user.id]);
    } else {
      requests = await pool.query(`
        SELECT r.*, u.name as tech_name, u.avatar as tech_avatar
        FROM requests r
        LEFT JOIN users u ON r.target_technician_id = u.id
        WHERE r.client_id = $1
        ORDER BY r.created_at DESC
      `, [req.user.id]);
    }
    res.json(requests.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar estado de solicitud (Técnico acepta/rechaza, o Cliente cancela)
router.put('/:id/status', authenticate, async (req, res) => {
  const { status } = req.body; // 'assigned', 'completed', 'rejected', 'cancelled'
  try {
    const updated = await pool.query(
      'UPDATE requests SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    res.json(updated.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
