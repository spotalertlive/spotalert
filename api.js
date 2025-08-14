export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  res.status(200).json({
    oneSignalAppId: process.env.ONESIGNAL_APP_ID,
  });
}
