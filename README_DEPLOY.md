# Panduan Lengkap Deploy SITATIB React ke GitHub Pages & Google Apps Script

Aplikasi ini telah dimodifikasi agar dapat berjalan sebagai aplikasi frontend independen (di-hosting di GitHub Pages, Vercel, dsb.) namun tetap menggunakan **Google Spreadsheet & Google Apps Script (GAS)** sebagai databasenya.

Berikut adalah langkah-langkah detail untuk eksekusinya:

## Langkah 1: Setup Backend (Database & API) di Google Apps Script

1. **Buka Google Spreadsheet** Anda yang lama (atau buat baru) yang berisi sheet: `Users`, `Siswa`, `Kategori`, `LogData`.
2. Klik menu **Ekstensi > Apps Script**.
3. Jika sebelumnya ada file `Code.gs`, hapus semua isinya.
4. Buka file `src/data/Code.gs` pada kode React ini, salin **semua isi teksnya**, lalu **paste** ke dalam file `Code.gs` di editor Apps Script Anda.
5. Klik **Simpan** (ikon disket).
6. Lakukan Deploy Web App:
   - Klik tombol **Terapkan (Deploy) > Deployment baru** di sudut kanan atas.
   - Pilih jenis roda gigi (Select type): **Aplikasi Web (Web App)**.
   - Isi Deskripsi (misal: "API v1").
   - **Jalankan sebagai (Execute as)**: Pilih "Saya" (Me).
   - **Siapa yang memiliki akses (Who has access)**: Pilih **Semua Orang (Anyone)** (Sangat penting agar React bisa menembak API tanpa error CORS/Login Google).
   - Klik **Terapkan (Deploy)**.
   - Berikan izin otorisasi jika diminta (Pilih akun > Lanjutan > Buka... > Izinkan).
7. **Copy URL Aplikasi Web** yang muncul (Biasanya berawalan `https://script.google.com/macros/s/.../exec`).

## Langkah 2: Hubungkan Frontend React dengan URL GAS

1. Buka file `.env` di dalam folder root aplikasi (jika belum ada, buat file bernama `.env`).
2. Tambahkan baris berikut, dan ganti nilainya dengan URL Web App dari Langkah 1:
   ```env
   VITE_GAS_URL=https://script.google.com/macros/s/AKfycb..._contoh_url/exec
   ```
3. Jika URL sudah dimasukkan, maka sistem akan menggunakan backend spreadsheet Anda secara Live. (Jika dikosongkan, sistem masih akan berjalan di "Mode Simulasi" untuk testing).

## Langkah 3: Deploy Frontend React ke GitHub Pages

Kita akan menggunakan `gh-pages` untuk melakukan build dan push ke GitHub secara otomatis.

1. **Inisiasi Git (jika belum)**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - SITATIB React version"
   ```
2. **Buat Repository di GitHub**:
   - Buka github.com, buat repository baru (misal: `sitatib-app`).
   - Salin link repository.
3. **Hubungkan terminal lokal ke GitHub**:
   ```bash
   git remote add origin https://github.com/username-anda/sitatib-app.git
   ```
4. **Instal module gh-pages**:
   ```bash
   npm install gh-pages --save-dev
   ```
5. **Konfigurasi `package.json`**:
   Buka `package.json` lalu tambahkan atribut `homepage` (taruh di bagian paling atas/setelah nama project):
   ```json
   "homepage": "https://username-anda.github.io/sitatib-app",
   ```
   Lalu pada bagian `"scripts"`, tambahkan script predeploy dan deploy:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist",
     "dev": "vite",
     ...
   }
   ```
6. **Deploy!**:
   Jalankan perintah ini di terminal Anda:
   ```bash
   npm run deploy
   ```
   Proses ini akan otomatis membuild aplikasi menjadi statis (folder `dist`) dan mendorongnya ke branch `gh-pages`.
7. **Aktifkan GitHub Pages**:
   - Di halaman repository GitHub Anda, pergi ke tab **Settings** > **Pages**.
   - Pada bagian *Build and deployment*, pastikan Source = **Deploy from a branch**.
   - Pada bagian Branch, pilih `gh-pages` dan klik **Save**.
8. **Selesai!** Aplikasi Anda dapat diakses secara publik melalui URL `homepage` yang Anda set. Karena menggunakan *Client-Side Rendering (SPA)*, aplikasi akan otomatis memuat dan berinteraksi dengan API Google Apps Script.

---
> **Catatan Tambahan**: Struktur kolom di spreadsheet *tidak diubah sama sekali*. Fungsi `doPost` di `Code.gs` telah diadaptasi untuk membaca dan menulis dari/ke struktur persis yang sebelumnya digunakan.
