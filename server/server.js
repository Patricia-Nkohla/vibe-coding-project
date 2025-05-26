// server/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
require('dotenv').config();
const path = require('path');



const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
// Serve static HTML, CSS, JS from the client folder
app.use(express.static(path.join(__dirname, '../client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

sequelize.sync().then(() => {
  app.listen(process.env.PORT || 5000, () => console.log('Server running'));
});

// Twilio reminder scheduler
const cron = require('node-cron');
const twilio = require('twilio');
const Appointment = require('./models/appointment');
const User = require('./models/user');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const { Op } = require('sequelize');

cron.schedule('*/30 * * * *', async () => {
  console.log('⏰ Running reminder job...');
  try {
    const upcoming = await Appointment.findAll({
      include: [User],
      where: {
        appointmentDate: {
          [Op.between]: [
            new Date(),
            new Date(Date.now() + 60 * 60 * 1000) // next 1 hour
          ]
        }
      }
    });

    for (const appt of upcoming) {
      const message = `Reminder: You have an appointment at ${new Date(appt.appointmentDate).toLocaleString()}`;

      if (appt.patientPhone) {
        await client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE,
          to: appt.patientPhone
        });
        console.log(`✅ Reminder sent to ${appt.patientPhone}`);
      }
    }
  } catch (err) {
    console.error('❌ Reminder job failed:', err);
  }
});

