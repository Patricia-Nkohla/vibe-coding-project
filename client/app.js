// client/app.js
const apiBase = 'http://localhost:5000/api';

// Handle Register
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    const res = await fetch(`${apiBase}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    const data = await res.json();
    document.getElementById('registerMessage').textContent = data.message || data.error;
  });
}

// Handle Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    const res = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = 'dashboard.html';
    } else {
      document.getElementById('loginMessage').textContent = data.error || 'Login failed';
    }
  });
}

// Handle Appointment Submission
const appointmentForm = document.getElementById('appointmentForm');
if (appointmentForm) {
  appointmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const patientName = document.getElementById('patientName').value;
    const patientEmail = document.getElementById('patientEmail').value;
    const patientPhone = document.getElementById('patientPhone').value;
    const appointmentDate = document.getElementById('appointmentDate').value;
    const token = localStorage.getItem('token');

    const res = await fetch(`${apiBase}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ patientName, patientEmail, patientPhone, appointmentDate })
    });
    const data = await res.json();
    alert(data.message || data.error);
  });

  // Fetch and display appointments
  window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${apiBase}/appointments`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    const list = document.getElementById('appointmentsList');
    data.appointments?.forEach(app => {
      const li = document.createElement('li');
      li.textContent = `${app.patientName} - ${new Date(app.appointmentDate).toLocaleString()}`;
      list.appendChild(li);
    });
  });
}
