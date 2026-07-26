const fs = require('fs');

let code = fs.readFileSync('src/data/Code.gs', 'utf8');

const getSheetFn = `
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
`;

code = code.replace("function loginUser", getSheetFn + "\nfunction loginUser");

code = code.replace(/ss\.getSheetByName\(SHEET_NAMES\.USERS\)/g, "getSheetSafely(ss, SHEET_NAMES.USERS)");
code = code.replace(/ss\.getSheetByName\(SHEET_NAMES\.SISWA\)/g, "getSheetSafely(ss, SHEET_NAMES.SISWA)");
code = code.replace(/ss\.getSheetByName\(SHEET_NAMES\.KATEGORI\)/g, "getSheetSafely(ss, SHEET_NAMES.KATEGORI)");
code = code.replace(/ss\.getSheetByName\(SHEET_NAMES\.LOG\)/g, "getSheetSafely(ss, SHEET_NAMES.LOG)");

fs.writeFileSync('src/data/Code.gs', code);

// Now update gasCode.ts as well to include the new Code.gs content
let gasCodeCode = fs.readFileSync('src/data/gasCode.ts', 'utf8');
gasCodeCode = gasCodeCode.replace(/export const GAS_FILES = \[[\s\S]*\}\n\];/, 
`export const GAS_FILES = [
  {
    filename: 'Code.gs',
    language: 'javascript',
    description: 'Backend REST API untuk Google Apps Script. Salin seluruh kode ini ke dalam file Code.gs di Apps Script Anda.',
    code: \`${code.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`
  }
];`
);
fs.writeFileSync('src/data/gasCode.ts', gasCodeCode);
