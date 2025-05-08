const db = require('../config/db');
const bcrypt = require('bcrypt');

// Register a new patient
exports.register = async (req, res) => {
  const { first_name, last_name, email, password, phone, date_of_birth, gender, address } = req.body;

  try {
    // Check if user already exists
    const [existing] = await db.promise().query('SELECT * FROM patients WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.promise().query(`
      INSERT INTO patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, hashedPassword, phone, date_of_birth, gender, address]
    );

    res.status(201).json({ message: 'Patient registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Patient login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.promise().query('SELECT * FROM patients WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    req.session.userId = user.id;
    req.session.userRole = 'patient';
    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View own profile
exports.getProfile = async (req, res) => {
  const patientId = req.session.userId;

  try {
    const [rows] = await db.promise().query('SELECT id, first_name, last_name, email, phone, date_of_birth, gender, address FROM patients WHERE id = ?', [patientId]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  const patientId = req.session.userId;
  const { first_name, last_name, phone, date_of_birth, gender, address } = req.body;

  try {
    await db.promise().query(
      `UPDATE patients SET first_name = ?, last_name = ?, phone = ?, date_of_birth = ?, gender = ?, address = ? WHERE id = ?`,
      [first_name, last_name, phone, date_of_birth, gender, address, patientId]
    );
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
