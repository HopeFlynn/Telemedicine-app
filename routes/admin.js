const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../index');
const router = express.Router();

// Middleware to check if user is admin
function isAdmin(req, res, next) {
  if (req.session && req.session.admin) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

// Admin login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.query(`SELECT * FROM admin WHERE username = ?`, [username]);

    if (rows.length === 0) return res.status(400).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, rows[0].password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    req.session.admin = rows[0].id;
    res.json({ message: 'Admin login successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout admin
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out successfully' });
});

// View all doctors (admin only)
router.get('/doctors', isAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM doctors`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a doctor
router.post('/doctors', isAdmin, async (req, res) => {
  const { first_name, last_name, specialization, email, phone, schedule } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO doctors (first_name, last_name, specialization, email, phone, schedule)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, specialization, email, phone, schedule]
    );
    res.status(201).json({ message: 'Doctor added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// View all appointments
router.get('/appointments', isAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.id, p.first_name AS patient_name, d.first_name AS doctor_name, 
             a.appointment_date, a.appointment_time, a.status
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
