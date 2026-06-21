try { require('dotenv').config(); } catch (e) {}

const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ========== TELEGRAM LOGGER ==========
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function sendTelegramLog(message) {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) return;
  
  const text = encodeURIComponent(message.substring(0, 500));
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${text}&parse_mode=HTML&disable_notification=true`;
  
  https.get(url, () => {}).on('error', () => {});
}

// ========== VISITOR TRACKING MIDDLEWARE ==========
app.use((req, res, next) => {
  if (req.path === '/' || req.path === '/index.html') {
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'Unknown';
    const ua = req.headers['user-agent'] || 'Unknown';
    const time = new Date().toLocaleString();
    const country = req.headers['x-vercel-ip-country'] || 'Unknown';
    const referer = req.headers['referer'] || 'Direct';

    let device = 'Desktop';
    if (/Mobi|Android|iPhone|iPad/i.test(ua)) device = 'Mobile';
    if (/Tablet|iPad/i.test(ua)) device = 'Tablet';

    const msg = `👁 <b>New Visitor</b>\n⏰ ${time}\n🌍 ${country}\n📱 ${device}\n🔗 ${referer}\n🖥 ${ua.substring(0, 100)}`;
    sendTelegramLog(msg);
  }
  next();
});

// ========== API: Manual log from frontend ==========
app.all('/api/log', (req, res) => {
  const data = req.method === 'GET' ? req.query : req.body || {};
  const { action, username, linkName } = data;
  const time = new Date().toLocaleString();

  let emoji = '📝';
  if (action === 'payment_click') emoji = '💳';
  if (action === 'unlock_click') emoji = '🔓';
  if (action === 'link_open') emoji = '🔗';
  if (action === 'login') emoji = '🔑';
  if (action === 'logout') emoji = '🚪';

  const msg = `${emoji} <b>${action}</b>\n⏰ ${time}\n👤 ${username || 'Unknown'}\n🔗 ${linkName || 'N/A'}`;
  
  res.status(200).json({ ok: true });
  
  if (action) sendTelegramLog(msg);
});

// ========== Wallet endpoint ==========
app.get('/api/wallets', (req, res) => {
  res.json({
    bitcoin: process.env.BITCOIN_WALLET || "",
    litecoin: process.env.LITECOIN_WALLET || "",
    usdt: process.env.USDT_WALLET || ""
  });
});

// ========== Email endpoint ==========
app.post('/api/send-email', async (req, res) => {
  try {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { deviceId, linkName, paymentMethod, amount, timestamp, location } = req.body || {};
    
    if (!deviceId || !linkName || !paymentMethod || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await resend.emails.send({
      from: 'T4RLADY <onboarding@resend.dev>',
      to: ['dmm643934@gmail.com'],
      subject: `Payment Approval Request: ${linkName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>✈️ Payment Approval Request</h2>
          <p><strong>Device ID:</strong> ${deviceId}</p>
          <p><strong>Link:</strong> ${linkName}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
          <p><strong>Amount:</strong> $${amount}</p>
          <p><strong>Timestamp:</strong> ${timestamp || 'N/A'}</p>
          <p><strong>Location:</strong> ${location || 'N/A'}</p>
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
    
    sendTelegramLog(`📧 <b>Payment Email Sent</b>\n🔗 ${linkName}\n💳 ${paymentMethod}\n💰 $${amount}\n📍 ${location || 'N/A'}`);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== Serve static files ==========
app.use(express.static(path.join(__dirname, 'public')));

// ========== Catch-all route ==========
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ========== Export for Vercel ==========
module.exports = app;

// ========== Local development ==========
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✈️ Server running at http://localhost:${PORT}`);
    console.log(`📱 Telegram bot: ${TELEGRAM_TOKEN ? 'Configured ✓' : 'NOT configured ✗'}`);
    console.log(`📱 Telegram chat: ${TELEGRAM_CHAT_ID ? 'Configured ✓' : 'NOT configured ✗'}`);
    console.log(`📧 Email: ${process.env.RESEND_API_KEY ? 'Configured ✓' : 'NOT configured ✗'}`);
  });
}