const { cmd, guruOk, body, out } = require("./_db");

const KEY = "kuis:masuk";
const MAX_LIST = 2000;
const str = (x, n) => String(x == null ? "" : x).trim().slice(0, n);
const num = (x, lo, hi) => Math.max(lo, Math.min(hi, Math.round(+x || 0)));

module.exports = async (req, res) => {
  try {
    // Siswa mengirim hasil (publik)
    if (req.method === "POST") {
      const d = body(req);
      if (!d || !str(d.n, 100) || !str(d.k, 100)) return out(res, 400, { error: "Nama dan kelas wajib diisi" });
      const rec = {
        n: str(d.n, 100),
        k: str(d.k, 100),
        b: num(d.b, 0, 1000),
        t: num(d.t, 0, 1000),
        p: num(d.p, 0, 100),
        d: num(d.d, 0, 100000),
        j: str(d.j, 200),
        w: new Date().toISOString(),
      };
      await cmd("RPUSH", KEY, JSON.stringify(rec));
      await cmd("LTRIM", KEY, -MAX_LIST, -1);
      return out(res, 200, { ok: true });
    }

    // Selebihnya khusus guru
    if (!guruOk(req)) return out(res, 401, { error: "Tidak diizinkan" });

    if (req.method === "GET") {
      if (req.query && req.query.count) return out(res, 200, { count: await cmd("LLEN", KEY) });
      const list = (await cmd("LRANGE", KEY, 0, -1)) || [];
      return out(res, 200, list.map((x) => { try { return JSON.parse(x); } catch (e) { return null; } }).filter(Boolean));
    }
    if (req.method === "DELETE") {
      await cmd("DEL", KEY);
      return out(res, 200, { ok: true });
    }
    out(res, 405, { error: "Method not allowed" });
  } catch (e) {
    out(res, 500, { error: e.message });
  }
};
