export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    // Validate request body
    const body = req.body || {};
    const { deviceId, username, linkName, paymentMethod, amount, timestamp, location, paymentProof } = body;
    
    // Log received data for debugging
    console.log('📧 Email request received:', { 
      deviceId, 
      username, 
      linkName, 
      paymentMethod, 
      amount,
      hasPaymentProof: !!paymentProof
    });

    // Validate required fields
    const missingFields = [];
    if (!deviceId) missingFields.push('deviceId');
    if (!linkName) missingFields.push('linkName');
    if (!paymentMethod) missingFields.push('paymentMethod');
    if (!amount) missingFields.push('amount');

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Validate amount is a number
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid amount' 
      });
    }

    // Check if Resend API key exists
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not configured');
      return res.status(500).json({ 
        success: false, 
        error: 'Email service not configured' 
      });
    }

    // Import and initialize Resend
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Prepare email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .field { margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #667eea; }
          .label { color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
          .value { color: #333; font-size: 16px; font-weight: 500; }
          .amount { font-size: 24px; color: #667eea; font-weight: bold; }
          .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin-top: 20px; }
          .proof-section { margin-top: 20px; padding: 15px; background: #e8f5e9; border-radius: 8px; border: 1px solid #4caf50; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✈️ T4RLADY</h1>
            <p style="font-size: 18px; margin: 10px 0;">Payment Approval Request</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">👤 Device ID / Username</div>
              <div class="value">${escapeHtml(username || deviceId)}</div>
            </div>
            
            <div class="field">
              <div class="label">🔗 Requested Link</div>
              <div class="value">${escapeHtml(linkName)}</div>
            </div>
            
            <div class="field">
              <div class="label">💳 Payment Method</div>
              <div class="value">${escapeHtml(paymentMethod)}</div>
            </div>
            
            <div class="field">
              <div class="label">💰 Amount</div>
              <div class="amount">$${parseFloat(amount).toFixed(2)}</div>
            </div>
            
            <div class="field">
              <div class="label">📅 Timestamp</div>
              <div class="value">${escapeHtml(timestamp || new Date().toISOString())}</div>
            </div>
            
            <div class="field">
              <div class="label">📍 Location</div>
              <div class="value">${escapeHtml(location || 'Not provided')}</div>
            </div>
            
            ${paymentProof ? `
              <div class="proof-section">
                <h3>📎 Payment Proof Attached</h3>
                <p>Payment proof has been submitted with this request.</p>
                <pre style="background: white; padding: 10px; border-radius: 5px; overflow-x: auto; font-size: 12px;">${escapeHtml(paymentProof.substring(0, 500))}${paymentProof.length > 500 ? '...' : ''}</pre>
              </div>
            ` : ''}
            
            <div class="warning">
              <h3>⚡ Action Required</h3>
              <p>To approve this payment, add the device ID <strong>"${escapeHtml(deviceId)}"</strong> to your <code>approved.json</code> file with the link name <strong>"${escapeHtml(linkName)}"</strong>.</p>
              <p style="margin-top: 10px; font-size: 14px;">Example entry:</p>
              <pre style="background: #333; color: #fff; padding: 10px; border-radius: 5px; font-size: 12px;">{
  "${escapeHtml(deviceId)}": ["${escapeHtml(linkName)}"]
}</pre>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    console.log('📤 Sending email to dmm643934@gmail.com...');
    const { data, error } = await resend.emails.send({
      from: 'T4RLADY <onboarding@resend.dev>',
      to: ['dmm643934@gmail.com'],
      reply_to: 'dmm643934@gmail.com',
      subject: `✈️ Payment Approval: ${linkName} - $${parseFloat(amount).toFixed(2)} from ${username || deviceId}`,
      html: emailHtml,
      tags: [
        { name: 'category', value: 'payment_approval' },
        { name: 'link', value: linkName }
      ]
    });

    if (error) {
      console.error('❌ Resend API error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to send email',
        details: error.message
      });
    }

    // Log success
    console.log('✅ Email sent successfully:', data?.id);

    // Send Telegram notification
    await sendTelegramNotification({
      username: username || deviceId,
      linkName,
      paymentMethod,
      amount,
      timestamp,
      emailId: data?.id
    });

    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Payment approval request sent successfully',
      emailId: data?.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Email handler error:', error);
    
    // Try to send error notification to Telegram
    try {
      await sendTelegramNotification({
        error: error.message,
        stack: error.stack?.substring(0, 200),
        timestamp: new Date().toISOString()
      });
    } catch (tgError) {
      console.error('Failed to send error notification:', tgError);
    }

    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
}

// Helper function to escape HTML
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Helper function to send Telegram notification
async function sendTelegramNotification(data) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.log('Telegram not configured, skipping notification');
    return;
  }

  try {
    let message;
    
    if (data.error) {
      // Error notification
      message = `❌ <b>Email Error</b>\n⏰ ${data.timestamp}\n📝 ${data.error}\n🔍 ${data.stack || 'No stack trace'}`;
    } else {
      // Success notification
      message = `📧 <b>Payment Email Sent</b>\n⏰ ${new Date().toLocaleString()}\n👤 ${data.username}\n🔗 ${data.linkName}\n💳 ${data.paymentMethod}\n💰 $${parseFloat(data.amount).toFixed(2)}\n🆔 ${data.emailId || 'N/A'}`;
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_notification: data.error ? false : true
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API error:', errorData);
    } else {
      console.log('✅ Telegram notification sent');
    }
  } catch (error) {
    console.error('Failed to send Telegram notification:', error.message);
  }
}