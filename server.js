try { require('dotenv').config(); } catch (e) {}

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ========== TELEGRAM LOGGER (non-blocking) ==========
function sendTelegramLog(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  
  // Use a simple GET request that completes instantly
  const text = encodeURIComponent(message.substring(0, 500));
  const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${text}&parse_mode=HTML&disable_notification=true`;
  
  // Fire and completely forget - no callbacks
  try {
    const req = require('https').get(url);
    req.on('error', () => {});
    req.setTimeout(1000, () => req.destroy());
  } catch (e) {}
}

// ========== VISITOR TRACKING ==========
app.use((req, res, next) => {
  if (req.path === '/' || req.path === '/index.html') {
    const country = req.headers['x-vercel-ip-country'] || 'Unknown';
    const ua = req.headers['user-agent'] || 'Unknown';
    const device = /Mobi|Android|iPhone/i.test(ua) ? 'Mobile' : 'Desktop';
    sendTelegramLog(`👁 Visitor | ${country} | ${device}`);
  }
  next();
});

// API log - respond FIRST, then send Telegram
app.post('/api/log', (req, res) => {
  // Respond immediately
  res.status(200).json({ ok: true });
  
  // Then send Telegram (non-blocking)
  const { action, username, linkName } = req.body || {};
  const emoji = action === 'payment_click' ? '💳' : action === 'login' ? '🔑' : action === 'link_open' ? '🔗' : action === 'unlock_click' ? '🔓' : '📝';
  sendTelegramLog(`${emoji} ${action} | ${username || '?'} | ${linkName || '?'}`);
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
    
    res.status(200).json({ success: true });
    
    // Send Telegram after response
    sendTelegramLog(`📧 Payment | ${linkName} | ${paymentMethod} | $${amount}`);
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

// Export for Vercel
module.exports = app;

// Local only
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✈️ Server: http://localhost:${PORT}`);
  });
}