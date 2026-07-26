export const PANDUAN_SETUP_TEXT = `PANDUAN LENGKAP DEPLOY SITATIB (REACT + GOOGLE APPS SCRIPT API)

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
`;

export const GAS_FILES = [
  {
    filename: 'Code.gs',
    language: 'javascript',
    description: 'Backend REST API untuk Google Apps Script. Salin seluruh kode ini ke dalam file Code.gs di Apps Script Anda.',
    code: `var SHEET_NAMES = {
  USERS: "Users",
  SISWA: "Siswa",
  KATEGORI: "Kategori",
  LOG: "LogData"
};

function getSpreadsheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

// REST API ENTRY POINT
function doPost(e) {
  try {
    var request = JSON.parse(e.postData.contents);
    var action = request.action;
    var payload = request.payload;
    var response = { success: false, message: "Action not found" };

    if (action === "login") {
      response = loginUser(payload.username, payload.password);
    } else if (action === "getInitialData") {
      response = getInitialData(payload.userRole);
    } else if (action === "tambahPelanggaran") {
      response = tambahPelanggaran(payload);
    } else if (action === "kurangiPelanggaran") {
      response = kurangiPelanggaran(payload);
    } else if (action === "tambahSiswa") {
      response = tambahSiswa(payload);
    }

    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// OPTIONS method is required for CORS preflight
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}

function loginUser(username, password) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAMES.USERS);
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row || !row[1]) continue;
    
    var u = String(row[1]).trim();
    var p = String(row[2]).trim();
    
    if (u === username && p === password) {
      return {
        success: true,
        user: {
          id: row[0],
          username: row[1],
          nama: row[3],
          role: row[4],
          jabatan: row[5] || 'Tim Tata Tertib / Guru BK',
          nip: row[6] || '-'
        }
      };
    }
  }
  return { success: false, message: "Username atau password salah!" };
}

function getInitialData(userRole) {
  var ss = getSpreadsheet();
  
  // Ambil Data Siswa
  var sheetSiswa = ss.getSheetByName(SHEET_NAMES.SISWA);
  var dataSiswa = sheetSiswa.getDataRange().getValues();
  var listSiswa = [];
  for (var i = 1; i < dataSiswa.length; i++) {
    var r = dataSiswa[i];
    if (r[0]) {
      listSiswa.push({
        nis: String(r[0]),
        namaSiswa: String(r[1] || ""),
        kelas: String(r[2] || ""),
        totalPoin: Number(r[3]) || 0,
        waliKelas: String(r[4] || "Dra. Hj. Nur Aini, M.Pd.")
      });
    }
  }
  
  // Ambil Data Kategori
  var sheetKategori = ss.getSheetByName(SHEET_NAMES.KATEGORI);
  var dataKategori = sheetKategori.getDataRange().getValues();
  var listKategori = [];
  for (var j = 1; j < dataKategori.length; j++) {
    var rK = dataKategori[j];
    if (rK[0]) {
      listKategori.push({
        idPelanggaran: String(rK[0]),
        namaPelanggaran: String(rK[1] || ""),
        bobotPoin: Number(rK[2]) || 0,
        keterangan: String(rK[3] || "")
      });
    }
  }
  
  // Ambil Data Log
  var sheetLog = ss.getSheetByName(SHEET_NAMES.LOG);
  var dataLog = sheetLog.getDataRange().getValues();
  var listLog = [];
  for (var k = 1; k < dataLog.length; k++) {
    var rL = dataLog[k];
    if (rL[1]) {
      listLog.push({
        timestamp: rL[0] ? Utilities.formatDate(new Date(rL[0]), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss") : "",
        nis: String(rL[1]),
        namaSiswa: String(rL[2] || ""),
        jenisPelanggaran: String(rL[3] || ""),
        poinDitambahkanDikurangi: Number(rL[4]) || 0,
        keterangan: String(rL[5] || ""),
        namaPetugas: String(rL[6] || ""),
        rolePetugas: String(rL[7] || "")
      });
    }
  }
  
  return {
    success: true,
    siswa: listSiswa,
    kategori: listKategori,
    logs: listLog.reverse()
  };
}

function tambahPelanggaran(payload) {
  var ss = getSpreadsheet();
  var sheetSiswa = ss.getSheetByName(SHEET_NAMES.SISWA);
  var sheetLog = ss.getSheetByName(SHEET_NAMES.LOG);
  
  var dataSiswa = sheetSiswa.getDataRange().getValues();
  var rowIndex = -1;
  var poinSaatIni = 0;
  
  for (var i = 1; i < dataSiswa.length; i++) {
    if (String(dataSiswa[i][0]) === String(payload.nis)) {
      rowIndex = i + 1;
      poinSaatIni = Number(dataSiswa[i][3]) || 0;
      break;
    }
  }
  
  if (rowIndex === -1) {
    return { success: false, message: "Siswa dengan NIS " + payload.nis + " tidak ditemukan." };
  }
  
  var poinBaru = poinSaatIni + payload.poin;
  sheetSiswa.getRange(rowIndex, 4).setValue(poinBaru);
  sheetLog.appendRow([new Date(), payload.nis, payload.namaSiswa, payload.jenisPelanggaran, payload.poin, payload.keterangan, payload.namaPetugas, payload.rolePetugas]);
  
  return { success: true, message: "Pelanggaran berhasil dicatat! Total poin sekarang: " + poinBaru };
}

function kurangiPelanggaran(payload) {
  var ss = getSpreadsheet();
  var sheetSiswa = ss.getSheetByName(SHEET_NAMES.SISWA);
  var sheetLog = ss.getSheetByName(SHEET_NAMES.LOG);
  
  var dataSiswa = sheetSiswa.getDataRange().getValues();
  var rowIndex = -1;
  var poinSaatIni = 0;
  
  for (var i = 1; i < dataSiswa.length; i++) {
    if (String(dataSiswa[i][0]) === String(payload.nis)) {
      rowIndex = i + 1;
      poinSaatIni = Number(dataSiswa[i][3]) || 0;
      break;
    }
  }
  
  if (rowIndex === -1) {
    return { success: false, message: "Siswa dengan NIS " + payload.nis + " tidak ditemukan." };
  }
  
  var poinBaru = poinSaatIni - payload.poin;
  if (poinBaru < 0) poinBaru = 0;
  
  sheetSiswa.getRange(rowIndex, 4).setValue(poinBaru);
  sheetLog.appendRow([new Date(), payload.nis, payload.namaSiswa, "Pengurangan Poin", -payload.poin, payload.keterangan, payload.namaPetugas, payload.rolePetugas]);
  
  return { success: true, message: "Poin berhasil dikurangi! Total poin sekarang: " + poinBaru };
}

function tambahSiswa(payload) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAMES.SISWA);
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(payload.nis)) {
      return { success: false, message: "Siswa dengan NIS " + payload.nis + " sudah ada." };
    }
  }
  
  sheet.appendRow([payload.nis, payload.namaSiswa, payload.kelas, 0, payload.waliKelas || "Dra. Hj. Nur Aini, M.Pd."]);
  return { success: true, message: "Siswa baru berhasil ditambahkan!" };
}
`
  }
];
