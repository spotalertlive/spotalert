import { sbAdmin, ok, bad } from "./_lib/supabase.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { data, error } = await sbAdmin.from("people").select("*").order("created_at",{ascending:false});
    if (error) return bad(res, error.message, 500);
    return ok(res, data);
  }

  if (req.method === "POST") {
    const { label, meta } = req.body || {};
    if (!label) return bad(res, "label is required");
    const { data, error } = await sbAdmin
      .from("people")
      .insert({ label, meta: meta || null })
      .select()
      .single();
    if (error) return bad(res, error.message, 500);
    return ok(res, data);
  }

  res.status(405).end();
}
