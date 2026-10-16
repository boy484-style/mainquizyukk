const crypto = require("crypto");

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// Jalankan satu perintah Redis lewat REST API Upstash
async function cmd(...args) {
  if (!URL_ || !TOKEN) throw new Error("Database belum terhubung (env KV_REST_API_URL / KV_REST_API_TOKEN kosong).");
  const r = await fetch(URL_, {
    method: "POST",
    headers: { Authorization: "Bearer " + TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error(j.error || "Database error " + r.status);
  return j.result;
}

// Cek password guru (header x-guru) terhadap env GURU_PASSWORD
function guruOk(req) {
  const pw = process.env.GURU_PASSWORD;
  if (!pw) return false;
  let got = String(req.headers["x-guru"] || "");
  try { got = decodeURIComponent(got); } catch (e) {}
  const h = (x) => crypto.createHash("sha256").update(x).digest();
  return crypto.timingSafeEqual(h(got), h(pw));
}

function body(req) {
  let b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch (e) { b = null; } }
  return b && typeof b === "object" ? b : null;
}

function out(res, code, obj) {
  res.setHeader("Cache-Control", "no-store");
  res.status(code).json(obj);
}

module.exports = { cmd, guruOk, body, out };
