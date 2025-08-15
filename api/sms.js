import twilio from 'twilio';
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const { to, body } = (req.body || {});
    const msg = await client.messages.create({
      to: to || process.env.SMS_TO,
      from: process.env.TWILIO_FROM, // your Twilio number
      body: body || 'SpotAlert test SMS'
    });
    res.status(200).json({ ok: true, sid: msg.sid });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
