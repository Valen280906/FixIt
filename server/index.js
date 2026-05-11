import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import jobsRoutes from './routes/jobs.js';
import bidsRoutes from './routes/bids.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/bids', bidsRoutes);

app.get('/api/technicians', async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email FROM users WHERE role = 'technician'");
    const technicians = result.rows.map(t => ({
      id: t.id,
      name: t.name,
      avatar: `https://i.pravatar.cc/150?u=${t.id}`,
      verified: true,
      rating: 5.0,
      reviews: 0,
      distance: 'A 2.0 km',
      description: 'Técnico registrado en la plataforma.'
    }));
    res.json(technicians);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test DB Connection Route
import pool from './db.js';
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', db_time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
