const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const router = express.Router();

// Middleware to protect routes
const isAuthenticated = (req, res, next) => {
  if (req.session.doctor) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Register Doctor
router.post('/register', async (req, res) => {
  const { first_name, last_name, email, password, phone, specialization } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO doctors (first_name, last_name, email, password_hash, phone, specialization)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, hash, phone, specialization]
    );
    res.status(201).json({ message: 'Doctor registered successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login Doctor
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query(`SELECT * FROM doctors WHERE email = ?`, [email]);
    if (rows.length === 0) return res.status(400).json({ message: 'Doctor not found' });

    const isMatch = await bcrypt.compare(password, rows[0].password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    req.session.doctor = rows[0].id;
    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out successfully' });
});

// Profile (protected)
router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM doctors WHERE id = ?`, [req.session.doctor]);
    if (rows.length === 0) return res.status(404).json({ message: 'Doctor not found' });

    const doctor = rows[0];
    delete doctor.password_hash;
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
