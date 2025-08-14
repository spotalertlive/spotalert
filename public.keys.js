export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=86400');
  res.json({
    oneSignalAppId: process.env.ONESIGNAL_APP_ID
  });
}
