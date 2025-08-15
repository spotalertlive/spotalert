import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE;

if (!url || !key) {
  console.warn("Supabase env vars missing (SUPABASE_URL / SUPABASE_SERVICE_ROLE)");
}

export const sbAdmin = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false }
});

export const ok = (res, data = {}) => res.status(200).json(data);
export const bad = (res, msg = "Bad Request", code = 400) =>
  res.status(code).json({ error: msg });
