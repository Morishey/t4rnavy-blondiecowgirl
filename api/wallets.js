export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).json({
    bitcoin: process.env.BITCOIN_WALLET || "",
    litecoin: process.env.LITECOIN_WALLET || "",
    usdt: process.env.USDT_WALLET || ""
  });
}