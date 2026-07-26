const fs = require('fs');

let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

// Wrap tabs with condition
code = code.replace(
  /<button\s+onClick=\{\(\) => setActiveTab\('gascode'\)\}/g,
  "{(!currentUser || currentUser.role === 'ADMIN') && (\n            <button\n              onClick={() => setActiveTab('gascode')}"
);

code = code.replace(
  /<span>Panduan Setup<\/span>\s*<\/button>\s*/g,
  "<span>Panduan Setup</span>\n            </button>\n          )}"
);

code = code.replace(
  /<span>Panduan<\/span>\s*<\/button>\s*/g,
  "<span>Panduan</span>\n          </button>\n          )}"
);


fs.writeFileSync('src/components/Header.tsx', code);
