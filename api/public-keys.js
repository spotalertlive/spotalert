export default async function handler(req, res) {
  res.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate=3600');
  res.json({ oneSignalAppId: process.env.ONE_SIGNAL_APP_ID || '' });
}
