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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/bids', bidsRoutes);

app.get('/api/technicians', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, city, lat, lng, avatar, bio, phone, rating, reviews FROM users WHERE role = 'technician'"
    );
    const technicians = result.rows.map(t => ({
      id: t.id,
      name: t.name,
      avatar: t.avatar || `https://i.pravatar.cc/150?u=${t.id}`,
      verified: true,
      rating: parseFloat(t.rating) || 5.0,
      reviews: t.reviews || 0,
      distance: 'En plataforma',
      description: t.bio || 'Técnico registrado en la plataforma.',
      city: t.city || null,
      lat: t.lat ? parseFloat(t.lat) : null,
      lng: t.lng ? parseFloat(t.lng) : null,
      phone: t.phone || null
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
