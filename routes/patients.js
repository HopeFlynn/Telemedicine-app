const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const router = express.Router();

// Middleware to protect routes
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Register route
router.post('/register', async (req, res) => {
  const { first_name, last_name, email, password, phone, date_of_birth, gender, address } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, hash, phone, date_of_birth, gender, address]
    );
    res.status(201).json({ message: 'Patient registered successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query(`SELECT * FROM patients WHERE email = ?`, [email]);
    if (rows.length === 0) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, rows[0].password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    req.session.user = rows[0].id;
    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out successfully' });
});

// Profile route (protected)
router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM patients WHERE id = ?`, [req.session.user]);
    if (rows.length === 0) return res.status(404).json({ message: 'Patient not found' });

    const patient = rows[0];
    delete patient.password_hash;
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
