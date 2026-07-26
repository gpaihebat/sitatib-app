const fs = require('fs');
let code = fs.readFileSync('src/data/gasCode.ts', 'utf8');

code = code.replace(/\`const GAS_URL = "URL_ANDA"\`/g, "'const GAS_URL = \"URL_ANDA\"'");
code = code.replace(/\`src\/services\/api\.ts\`/g, "'src/services/api.ts'");

fs.writeFileSync('src/data/gasCode.ts', code);
