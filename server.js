// Load dotenv only locally
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not available on Vercel, use process.env directly
}

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Wallet endpoint
app.get('/api/wallets', (req, res) => {
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
    const { deviceId, linkName, paymentMethod, amount } = req.body;
    
    if (!deviceId || !linkName || !paymentMethod || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['dmm643934@gmail.com'],
      subject: `Payment: ${linkName}`,
      html: `<p>Device: ${deviceId}<br>Link: ${linkName}<br>Method: ${paymentMethod}<br>Amount: $${amount}</p>`,
    });

    if (error) return res.status(500).json({ error: 'Failed to send' });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;

// Local development only
if (require.main === module) {
  app.listen(process.env.PORT || 3001, () => {
    console.log('Server running on port ' + (process.env.PORT || 3001));
  });
}