export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const { subject, html } = (req.body || {});
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'alerts@spotalert.live',
        to: (process.env.EMAIL_TO || '').split(','),
        subject: subject || 'SpotAlert',
        html: html || '<p>SpotAlert test email</p>'
      })
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);
    res.status(200).json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
