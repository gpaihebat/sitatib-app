const fs = require('fs');

let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

code = code.replace(
  /\{\(\!currentUser \|\| currentUser\.role === 'ADMIN'\) && \(/g,
  "{(!currentUser || currentUser.role === 'ADMIN') && (\n              <>\n"
);

code = code.replace(
  /<span>Panduan Setup<\/span>\n\s*<\/button>\n\s*\)\}/g,
  "<span>Panduan Setup</span>\n            </button>\n          </>\n          )}"
);

code = code.replace(
  /<span>Panduan<\/span>\n\s*<\/button>\n\s*\)\}/g,
  "<span>Panduan</span>\n          </button>\n          </>\n          )}"
);

fs.writeFileSync('src/components/Header.tsx', code);
