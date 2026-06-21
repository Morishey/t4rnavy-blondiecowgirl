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

// ========== TELEGRAM LOGGER ==========
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function sendTelegramLog(message) {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) return;
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    })
  }).catch(() => {});
}

// ========== VISITOR TRACKING MIDDLEWARE ==========
app.use((req, res, next) => {
  if (req.path === '/' || req.path === '/index.html') {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
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

// API: Manual log from frontend
app.post('/api/log', (req, res) => {
  const { action, username, linkName } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const time = new Date().toLocaleString();

  let emoji = '📝';
  if (action === 'payment_click') emoji = '💳';
  if (action === 'unlock_click') emoji = '🔓';
  if (action === 'link_open') emoji = '🔗';
  if (action === 'login') emoji = '🔑';
  if (action === 'logout') emoji = '🚪';

  const msg = `${emoji} <b>${action}</b>\n⏰ ${time}\n👤 ${username || 'Unknown'}\n🔗 ${linkName || 'N/A'}`;
  sendTelegramLog(msg);
  res.json({ ok: true });
});

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
    
    // Log email sent to Telegram
    sendTelegramLog(`📧 <b>Payment Email Sent</b>\n🔗 ${linkName}\n💳 ${paymentMethod}\n💰 $${amount}`);
    
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