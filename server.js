// Load dotenv only locally
try { require('dotenv').config(); } catch (e) {}

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ========== TELEGRAM LOGGER ==========
function sendTelegramLog(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  
  const text = encodeURIComponent(message.substring(0, 500));
  const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${text}&parse_mode=HTML`;
  
  require('https').get(url, (res) => {
    res.on('data', () => {});
  }).on('error', () => {});
}

// ========== VISITOR TRACKING ==========
app.use((req, res, next) => {
  if (req.path === '/' || req.path === '/index.html') {
    const ua = req.headers['user-agent'] || 'Unknown';
    const time = new Date().toLocaleString();
    const country = req.headers['x-vercel-ip-country'] || 'Unknown';
    let device = /Mobi|Android|iPhone/i.test(ua) ? 'Mobile' : 'Desktop';
    
    sendTelegramLog(`👁 <b>New Visitor</b>\n⏰ ${time}\n🌍 ${country}\n📱 ${device}`);
  }
  next();
});

// API log endpoint
app.post('/api/log', (req, res) => {
  const { action, username, linkName } = req.body || {};
  const time = new Date().toLocaleString();
  
  let emoji = '📝';
  if (action === 'payment_click') emoji = '💳';
  if (action === 'unlock_click') emoji = '🔓';
  if (action === 'link_open') emoji = '🔗';
  if (action === 'login') emoji = '🔑';
  if (action === 'logout') emoji = '🚪';
  
  sendTelegramLog(`${emoji} <b>${action}</b>\n⏰ ${time}\n👤 ${username || 'Unknown'}\n🔗 ${linkName || 'N/A'}`);
  
  res.status(200).json({ ok: true });
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
    const { deviceId, linkName, paymentMethod, amount } = req.body || {};
    
    if (!deviceId || !linkName || !paymentMethod || !amount) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const { error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['dmm643934@gmail.com'],
      subject: `Payment: ${linkName}`,
      html: `<p>Device: ${deviceId}<br>Link: ${linkName}<br>Method: ${paymentMethod}<br>Amount: $${amount}</p>`,
    });

    if (error) return res.status(500).json({ error: 'Failed' });
    
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

// START SERVER - THIS WAS MISSING!
app.listen(PORT, () => {
  console.log(`✈️ Server running at http://localhost:${PORT}`);
  console.log(`📱 Telegram: ${process.env.TELEGRAM_BOT_TOKEN ? 'Configured ✓' : 'NOT configured ✗'}`);
});

// Export for Vercel
module.exports = app;