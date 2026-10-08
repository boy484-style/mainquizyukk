# Kuis Sekolah (Vercel + Upstash Redis)

Isi folder:
- index.html : halaman siswa dan panel guru
- api/       : fungsi server (simpan soal, terima nilai, login guru)
- package.json

## Cara pasang

1. Upload semua isi folder ini ke satu repository GitHub baru
   (di GitHub: Add file > Upload files, tarik semua file dan folder api).
2. Di vercel.com: Add New > Project > pilih repository tadi > Deploy.
3. Buka project di Vercel > tab Storage > Create Database >
   pilih Upstash (Redis / KV) > Connect ke project ini.
   Variabel KV_REST_API_URL dan KV_REST_API_TOKEN terisi otomatis.
4. Settings > Environment Variables > tambah:
   Name  : GURU_PASSWORD
   Value : password guru pilihanmu
5. Tab Deployments > titik tiga di deploy terakhir > Redeploy.

## Cara pakai

- Siswa : https://NAMA-PROJECT.vercel.app
- Guru  : https://NAMA-PROJECT.vercel.app/#guru
  Username: guru, password: isi GURU_PASSWORD tadi.

Mengganti password: ubah GURU_PASSWORD di Vercel lalu Redeploy.
