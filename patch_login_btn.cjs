const fs = require('fs');
let code = fs.readFileSync('src/components/LoginModal.tsx', 'utf8');
code = code.replace(
  /className=\{`w-full py-2\.5[\s\S]*?mt-2"/,
  "className={`w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center justify-center space-x-2 mt-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}"
);
fs.writeFileSync('src/components/LoginModal.tsx', code);
