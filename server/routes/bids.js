import express from 'express';
import pool from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

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

// Técnico envía oferta
router.post('/', authenticate, async (req, res) => {
  if (req.user.role !== 'technician') return res.status(403).json({ error: 'Only technicians can bid' });
  
  const { request_id, amount } = req.body;
  try {
    const newBid = await pool.query(
      'INSERT INTO bids (request_id, technician_id, amount) VALUES ($1, $2, $3) RETURNING *',
      [request_id, req.user.id, amount]
    );
    res.status(201).json(newBid.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
