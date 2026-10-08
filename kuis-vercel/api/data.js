const { cmd, guruOk, body, out } = require("./_db");

const KEY = "kuis:data";

function valid(d) {
  if (!d || typeof d.judul !== "string" || !Array.isArray(d.soal) || d.soal.length > 50) return false;
  return d.soal.every(
    (s) =>
      s && typeof s.q === "string" && Array.isArray(s.o) && s.o.length === 4 &&
      s.o.every((o) => typeof o === "string") && Number.isInteger(s.a) && s.a >= 0 && s.a <= 3
  );
}

module.exports = async (req, res) => {
  try {
    if (req.method === "GET") {
      const v = await cmd("GET", KEY);
      return out(res, 200, v ? JSON.parse(v) : null);
    }
    if (req.method === "PUT") {
      if (!guruOk(req)) return out(res, 401, { error: "Tidak diizinkan" });
      const d = body(req);
      if (!valid(d)) return out(res, 400, { error: "Format soal tidak valid" });
      const pub = {
        judul: String(d.judul).slice(0, 200),
        info: String(d.info || "").slice(0, 2000),
        topik: String(d.topik || "").slice(0, 200),
        menit: Math.max(0, Math.min(300, parseInt(d.menit) || 0)),
        soal: d.soal,
      };
      const s = JSON.stringify(pub);
      if (s.length > 500000) return out(res, 413, { error: "Data terlalu besar" });
      await cmd("SET", KEY, s);
      return out(res, 200, { ok: true });
    }
    out(res, 405, { error: "Method not allowed" });
  } catch (e) {
    out(res, 500, { error: e.message });
  }
};
