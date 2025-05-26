// server/routes/appointments.js
const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');
const auth = require('../Middleware/auth');

// Create appointment
router.post('/', auth, async (req, res) => {
  try {
    const { patientName, patientEmail, patientPhone, appointmentDate } = req.body;
    const appointment = await Appointment.create({
      doctorId: req.user.id,
      patientName,
      patientEmail,
      patientPhone,
      appointmentDate
    });
    res.json({ message: 'Appointment created', appointment });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Get appointments for doctor
router.get('/', auth, async (req, res) => {
  try {
    const appointments = await Appointment.findAll({ where: { doctorId: req.user.id } });
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

module.exports = router;
