const fs = require('fs');

let code = fs.readFileSync('src/data/gasCode.ts', 'utf8');

const newPanduan = `PANDUAN LENGKAP DEPLOY SITATIB (REACT + GOOGLE APPS SCRIPT API)

Aplikasi ini menggunakan Frontend React.js yang di-hosting di GitHub Pages (atau hosting statis lainnya) dan Google Apps Script (GAS) sebagai Database API (Backend).

LANGKAH 1: SETUP DATABASE GOOGLE SHEETS
1. Buat Google Spreadsheet baru.
2. Buat 4 Sheet dengan nama persis sebagai berikut:
   - "Users": Berisi kolom (Header Baris 1): ID | Username | Password | Nama | Role | Jabatan | NIP
     (Role diisi: ADMIN, TIM TATIB, atau GURU. Jabatan diisi: Wali Kelas, Tim Tatib, Guru BK, dll)
   - "Siswa": Berisi kolom: NIS | Nama Siswa | Kelas | Total Poin | Wali Kelas
   - "Kategori": Berisi kolom: ID Pelanggaran | Nama Pelanggaran | Bobot Poin | Keterangan
   - "LogData": Berisi kolom: Timestamp | NIS | Nama Siswa | Jenis Pelanggaran | Poin Ditambahkan/Dikurangi | Keterangan | Nama Petugas | Role Petugas

LANGKAH 2: SETUP BACKEND (DATABASE & API)
1. Klik menu Ekstensi > Apps Script di Google Sheets Anda.
2. Hapus kode yang ada, copy paste seluruh isi file 'Code.gs' (dari Tab Kode Backend GAS) ke dalam editor Apps Script.
3. Klik tombol Simpan (ikon disket).
4. Klik Terapkan (Deploy) > Deployment Baru.
5. Pilih jenis: Aplikasi Web.
   - Deskripsi: "API SITATIB v1"
   - Jalankan sebagai: "Saya" (Me)
   - Siapa yang memiliki akses: "Semua Orang" (Anyone) -> INI SANGAT PENTING (agar bisa diakses Frontend tanpa error CORS).
6. Klik Terapkan (Deploy), dan setujui otorisasi akun Google (Advanced -> Go to Project).
7. Salin URL Aplikasi Web yang dihasilkan (berawalan https://script.google.com/macros/s/.../exec).
8. PASTIKAN UNTUK SELALU MENGGUNAKAN "New Version" jika Anda mengupdate kode Apps Script nantinya.

LANGKAH 3: UPDATE URL API DI FRONTEND
- Untuk mengupdate URL tanpa build ulang, karena aplikasi sudah di-deploy:
  Jika Anda mengclone repo ini, masukkan URL tersebut ke variabel \`const GAS_URL = "URL_ANDA"\` di dalam file \`src/services/api.ts\` baris 4.

CATATAN GAGAL MEMUAT DATA:
- Jika saat login atau membuka aplikasi Anda menemui gagal memuat data atau error "getDataRange", pastikan nama ke-4 Sheet Anda (Users, Siswa, Kategori, LogData) sudah persis sesuai, tidak ada typo atau spasi ekstra di nama sheet-nya.
`;

code = code.replace(/export const PANDUAN_SETUP_TEXT = `[\s\S]*?`;/, "export const PANDUAN_SETUP_TEXT = `" + newPanduan + "`;");

fs.writeFileSync('src/data/gasCode.ts', code);
