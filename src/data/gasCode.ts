export const PANDUAN_SETUP_TEXT = `PANDUAN LENGKAP DEPLOY SITATIB (REACT + GOOGLE APPS SCRIPT API)

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
  Jika Anda mengclone repo ini, masukkan URL tersebut ke variabel 'const GAS_URL = "URL_ANDA"' di dalam file 'src/services/api.ts' baris 4.

CATATAN GAGAL MEMUAT DATA:
- Jika saat login atau membuka aplikasi Anda menemui gagal memuat data atau error "getDataRange", pastikan nama ke-4 Sheet Anda (Users, Siswa, Kategori, LogData) sudah persis sesuai, tidak ada typo atau spasi ekstra di nama sheet-nya.
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


function getSheetSafely(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (sheet) return sheet;
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().trim().toLowerCase() === name.trim().toLowerCase()) {
      return sheets[i];
    }
  }
  throw new Error("Sheet '" + name + "' tidak ditemukan. Pastikan nama sheet sudah benar!");
}

function loginUser(username, password) {
  var ss = getSpreadsheet();
  var sheet = getSheetSafely(ss, SHEET_NAMES.USERS);
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
  var sheetSiswa = getSheetSafely(ss, SHEET_NAMES.SISWA);
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
  var sheetKategori = getSheetSafely(ss, SHEET_NAMES.KATEGORI);
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
  var sheetLog = getSheetSafely(ss, SHEET_NAMES.LOG);
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
  var sheetSiswa = getSheetSafely(ss, SHEET_NAMES.SISWA);
  var sheetLog = getSheetSafely(ss, SHEET_NAMES.LOG);
  
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
  var sheetSiswa = getSheetSafely(ss, SHEET_NAMES.SISWA);
  var sheetLog = getSheetSafely(ss, SHEET_NAMES.LOG);
  
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
  var sheet = getSheetSafely(ss, SHEET_NAMES.SISWA);
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
