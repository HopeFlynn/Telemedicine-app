// index.js
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./config/db');

const app = express();

// Session setup
const sessionStore = new MySQLStore({}, pool);

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}));

app.use(cors());
app.use(bodyParser.json());

// Route imports
const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const adminRoutes = require('./routes/admin');

// Use routes
app.use('/patients', patientRoutes);
app.use('/doctors', doctorRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/admin', adminRoutes);

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

app.get('/', (req, res) => {
  res.send('Welcome to the Telemedicine App');
});
