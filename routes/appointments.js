const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Middleware to ensure user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session.user || req.session.doctor) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
};

// Create appointment
router.post('/', isAuthenticated, async (req, res) => {
  const { doctor_id, patient_id, date, time, reason } = req.body;
  try {
    await pool.query(
      `INSERT INTO appointments (doctor_id, patient_id, date, time, reason)
       VALUES (?, ?, ?, ?, ?)`,
      [doctor_id, patient_id, date, time, reason]
    );
    res.status(201).json({ message: 'Appointment created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all appointments for a patient
router.get('/patient/:id', isAuthenticated, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM appointments WHERE patient_id = ?`, [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all appointments for a doctor
router.get('/doctor/:id', isAuthenticated, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM appointments WHERE doctor_id = ?`, [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel an appointment
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    await pool.query(`DELETE FROM appointments WHERE id = ?`, [req.params.id]);
    res.json({ message: 'Appointment canceled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
