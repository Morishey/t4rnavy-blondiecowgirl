const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// API endpoint
app.post('/api/send-email', async (req, res) => {
  const { deviceId, linkName, paymentMethod, amount, timestamp, location } = req.body;

  if (!deviceId || !linkName || !paymentMethod || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'executive-allure <onboarding@resend.dev>',
      to: ['edithkeller44@hotmail.com'],
      subject: `Payment Approval Request: ${linkName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>✈️ Payment Approval Request</h2>
          <p><strong>Device ID:</strong> ${deviceId}</p>
          <p><strong>Link:</strong> ${linkName}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
          <p><strong>Amount:</strong> $${amount}</p>
          <p><strong>Timestamp:</strong> ${timestamp}</p>
          <p><strong>Location:</strong> ${location}</p>
          <hr />
          <p>To approve, add this device ID to your <code>approved.json</code> with the link name.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email via Resend' });
    }

    console.log('Email sent successfully:', data);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Export for Vercel
module.exports = app;

// Only listen if not on Vercel
if (process.env.NODE_ENV !== 'production') {
  const os = require('os');
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✈️ Server running at http://localhost:${PORT}`);
    
    // Print network URLs for phone access
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          console.log(`📱 Phone access: http://${net.address}:${PORT}`);
        }
      }
    }
  });
}