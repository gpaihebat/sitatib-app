const fs = require('fs');
const codeStr = fs.readFileSync('src/data/Code.gs', 'utf8');

let gasCodeStr = `export const PANDUAN_SETUP_TEXT = \`PANDUAN LENGKAP DEPLOY SITATIB (REACT + GOOGLE APPS SCRIPT API)

Aplikasi ini menggunakan Frontend React.js yang di-hosting di GitHub Pages (atau hosting statis lainnya) dan Google Apps Script (GAS) sebagai Database API (Backend).

LANGKAH 1: SETUP BACKEND (DATABASE & API)
1. Buka Google Spreadsheet baru atau yang lama, pastikan memiliki sheet: Users, Siswa, Kategori, LogData.
2. Klik menu Ekstensi > Apps Script.
3. Hapus kode yang ada, copy paste seluruh isi file 'src/data/Code.gs' (Bisa dicopy dari menu Panduan) ke dalam editor Apps Script.
4. Klik tombol Simpan (ikon disket).
5. Klik Terapkan (Deploy) > Deployment Baru.
6. Pilih jenis: Aplikasi Web.
   - Deskripsi: "API SITATIB v1"
   - Jalankan sebagai: "Saya" (Me)
   - Siapa yang memiliki akses: "Semua Orang" (Anyone) -> INI SANGAT PENTING (agar terhindar dari CORS).
7. Klik Terapkan (Deploy), berikan izin otorisasi jika diminta.
8. Salin URL Aplikasi Web yang dihasilkan (berawalan https://script.google.com/macros/s/.../exec).

LANGKAH 2: HUBUNGKAN FRONTEND
1. Buka file .env di project React Anda (jika belum ada, buat file '.env' di folder root).
2. Tambahkan variabel ini:
   VITE_GAS_URL=URL_YANG_ANDA_SALIN_DARI_LANGKAH_1
3. Simpan file .env. (Aplikasi otomatis beralih menggunakan backend tersebut).

LANGKAH 3: DEPLOY KE GITHUB PAGES
1. Buka package.json, tambahkan "homepage": "https://<username-github>.github.io/<nama-repo>" di bagian atas.
2. Pastikan sudah ada script deploy:
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
3. Instal gh-pages (jika belum):
   npm install gh-pages --save-dev
4. Jalankan perintah deploy:
   npm run deploy
5. Di pengaturan Repository GitHub > Pages, set source ke branch 'gh-pages'.
6. Aplikasi Anda sudah online dan terhubung dengan Google Sheets secara realtime!
\`;

export const GAS_FILES = [
  {
    filename: 'Code.gs',
    language: 'javascript',
    description: 'Backend REST API untuk Google Apps Script. Salin seluruh kode ini ke dalam file Code.gs di Apps Script Anda.',
    code: \`${codeStr.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`
  }
];
`;

fs.writeFileSync('src/data/gasCode.ts', gasCodeStr);
