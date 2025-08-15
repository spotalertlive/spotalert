import { sbAdmin, ok, bad } from "./_lib/supabase.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { data, error } = await sbAdmin
      .from("alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) return bad(res, error.message, 500);
    return ok(res, data);
  }

  if (req.method === "POST") {
    const payload = req.body || {};
    if (!payload.severity) payload.severity = "moderate";
    const { data, error } = await sbAdmin.from("alerts").insert(payload).select().single();
    if (error) return bad(res, error.message, 500);
    return ok(res, data);
  }

  res.status(405).end();
}
