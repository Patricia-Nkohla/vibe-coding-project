// server/models/Appointment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.js');

const Appointment = sequelize.define('Appointment', {
  patientName: DataTypes.STRING,
  patientEmail: DataTypes.STRING,
  patientPhone: DataTypes.STRING,
  appointmentDate: DataTypes.DATE,
});

User.hasMany(Appointment, { foreignKey: 'doctorId' });
Appointment.belongsTo(User, { foreignKey: 'doctorId' });

module.exports = Appointment;
