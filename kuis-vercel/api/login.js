const { guruOk, out } = require("./_db");

module.exports = async (req, res) => {
  if (req.method !== "POST") return out(res, 405, { error: "Method not allowed" });
  if (!process.env.GURU_PASSWORD) return out(res, 500, { error: "GURU_PASSWORD belum diisi di Vercel (Settings > Environment Variables)." });
  if (!guruOk(req)) return out(res, 401, { error: "Password salah" });
  out(res, 200, { ok: true });
};
