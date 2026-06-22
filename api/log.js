export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, username, linkName } = req.body;
    
    const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Missing Telegram credentials');
      return res.status(200).json({ 
        success: false, 
        error: 'Telegram not configured' 
      });
    }

    // Format message based on action type
    const emojiMap = {
      'payment_click': '💳',
      'unlock_click': '🔓',
      'link_open': '🔗',
      'login': '🔑',
      'logout': '🚪'
    };
    
    const emoji = emojiMap[action] || '📝';
    const message = `${emoji} <b>${action}</b>\n⏰ ${new Date().toLocaleString()}\n👤 ${username || 'Unknown'}\n🔗 ${linkName || 'N/A'}`;

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_notification: true
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Telegram API error:', data);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Log handler error:', error);
    return res.status(200).json({ success: false, error: error.message });
  }
}