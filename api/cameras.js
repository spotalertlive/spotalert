import { sbAdmin, ok, bad } from "./_lib/supabase.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { data, error } = await sbAdmin.from("cameras").select("*").order("created_at",{ascending:false});
    if (error) return bad(res, error.message, 500);
    return ok(res, data);
  }

  if (req.method === "POST") {
    const { name, hls_url, location } = req.body || {};
    if (!name || !hls_url) return bad(res, "name and hls_url required");
    const { data, error } = await sbAdmin
      .from("cameras")
      .insert({ name, hls_url, location: location || null })
      .select()
      .single();
    if (error) return bad(res, error.message, 500);
    return ok(res, data);
  }

  res.status(405).end();
}
