require('dotenv').config(); // ADD THIS at the very top

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Wallet endpoint
app.get('/api/wallets', (req, res) => {
  console.log('Wallets requested:', {
    bitcoin: process.env.BITCOIN_WALLET ? 'SET' : 'NOT SET',
    litecoin: process.env.LITECOIN_WALLET ? 'SET' : 'NOT SET',
    usdt: process.env.USDT_WALLET ? 'SET' : 'NOT SET'
  });
  
  res.json({
    bitcoin: process.env.BITCOIN_WALLET || "",
    litecoin: process.env.LITECOIN_WALLET || "",
    usdt: process.env.USDT_WALLET || ""
  });
});

// Email endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { deviceId, linkName, paymentMethod, amount, timestamp, location } = req.body;
    
    if (!deviceId || !linkName || !paymentMethod || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await resend.emails.send({
      from: 'executive-allure <onboarding@resend.dev>',
      to: ['dmm643934@gmail.com'],
      subject: `Payment Approval Request: ${linkName}`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2>✈️ Payment Approval Request</h2>
        <p><strong>Device ID:</strong> ${deviceId}</p>
        <p><strong>Link:</strong> ${linkName}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Amount:</strong> $${amount}</p>
        <p><strong>Timestamp:</strong> ${timestamp}</p>
        <p><strong>Location:</strong> ${location}</p>
      </div>`,
    });

    if (error) return res.status(500).json({ error: 'Failed to send email' });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✈️ Server running at http://localhost:${PORT}`);
  });
}