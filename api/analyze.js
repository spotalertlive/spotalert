export default async function handler(req, res) {
  try {
    const { title="SpotAlert test", message="Hello from SpotAlert", url="https://spotalert.live" } =
      (req.method === 'POST' ? req.body : req.query);

    const r = await fetch("https://api.onesignal.com/notifications", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        app_id: process.env.ONE_SIGNAL_APP_ID,
        included_segments: ["Subscribed Users"],
        headings: { en: title },
        contents: { en: message },
        url
      })
    });

    const data = await r.json();
    res.status(r.ok ? 200 : 400).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
