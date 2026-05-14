import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import nodemailer from 'nodemailer';

// Nodemailer config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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
      user: { id: user.id, name: user.name, email: user.email, role: user.role, city: user.city, avatar: user.avatar }
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

// ─── Forgot Password ────────────────────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query('SELECT id, name FROM users WHERE email=$1', [email]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60000);

    await pool.query('UPDATE users SET reset_code=$1, reset_expires=$2 WHERE email=$3', [code, expires, email]);
    console.log(`[DEV] CÓDIGO DE RECUPERACIÓN PARA ${email}: ${code}`);

    try {
      await transporter.sendMail({
        from: `"FixIt Soporte" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🔒 Código de Recuperación - FixIt',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #2563eb; padding: 24px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">FixIt</h1>
            </div>
            <div style="padding: 32px; background-color: white;">
              <h2 style="color: #1e293b; margin-top: 0;">Recuperación de Contraseña</h2>
              <p style="color: #475569; font-size: 16px; line-height: 1.6;">Hola <strong>${result.rows[0].name}</strong>,</p>
              <p style="color: #475569; font-size: 16px; line-height: 1.6;">Has solicitado restablecer tu contraseña. Utiliza el siguiente código de seguridad para continuar con el proceso:</p>
              
              <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 24px; text-align: center; margin: 32px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e293b;">${code}</span>
              </div>
              
              <p style="color: #ef4444; font-size: 14px; font-weight: 500; margin-bottom: 32px;">⚠️ Este código expirará en 15 minutos por tu seguridad.</p>
              
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 32px;" />
              
              <p style="color: #94a3b8; font-size: 12px; text-align: center;">Si no solicitaste este cambio, puedes ignorar este correo de forma segura. Tu cuenta sigue protegida.</p>
            </div>
            <div style="background-color: #f1f5f9; padding: 16px; text-align: center;">
              <p style="color: #64748b; font-size: 12px; margin: 0;">&copy; 2026 FixIt - Soluciones Profesionales</p>
            </div>
          </div>
        `
      });
    } catch (e) {
      console.log('Correo no enviado (falta password de app):', e.message);
    }

    res.json({ message: 'Código enviado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Verify Reset Code ────────────────────────────────────────────────────
router.post('/verify-reset-code', async (req, res) => {
  const { email, code } = req.body;
  try {
    const result = await pool.query('SELECT id FROM users WHERE email=$1 AND reset_code=$2 AND reset_expires > NOW()', [email, code]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Código inválido o expirado' });
    res.json({ message: 'Código verificado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Reset Password ───────────────────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(newPassword)) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.' });
    }

    const result = await pool.query('SELECT id FROM users WHERE email=$1 AND reset_code=$2 AND reset_expires > NOW()', [email, code]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Código inválido o expirado' });

    const hashed = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
    await pool.query('UPDATE users SET password=$1, reset_code=NULL, reset_expires=NULL WHERE email=$2', [hashed, email]);
    res.json({ message: 'Contraseña actualizada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
