// api/log.js
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, username, linkName } = req.body;

  // Get Telegram credentials from environment variables
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('Missing Telegram credentials');
    return res.status(500).json({ error: 'Server misconfigured: missing Telegram credentials' });
  }

  // Format the message
  const message = `📋 **Log Entry**\nAction: ${action}\nUsername: ${username || 'Unknown'}\nLink: ${linkName || 'N/A'}\nTime: ${new Date().toISOString()}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Telegram API error:', data);
      return res.status(response.status).json({ error: 'Telegram API error', details: data });
    }

    console.log('✅ Log sent to Telegram:', data.result.message_id);
    return res.status(200).json({ success: true, messageId: data.result.message_id });
  } catch (error) {
    console.error('❌ Error sending Telegram log:', error);
    return res.status(500).json({ error: 'Failed to send log', details: error.message });
  }
}