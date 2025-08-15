export default async function handler(req, res) {
  res.status(200).json({
    ok: true,
    ts: new Date().toISOString(),
    commit: process.env.VERCEL_GIT_COMMIT_SHA || null
  });
}
