export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const { title, message, url } = (req.body || {});
    const r = await fetch('https://api.onesignal.com/notifications', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        app_id: process.env.ONESIGNAL_APP_ID,
        included_segments: ['Subscribed Users'],
        headings: { en: title || 'SpotAlert' },
        contents: { en: message || 'Test notification' },
        url: url || process.env.SITE_URL
      })
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);
    res.status(200).json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
