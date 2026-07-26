const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(
  /<LoginModal\s+isOpen=\{isLoginModalOpen\}/g,
  "<LoginModal\n        isOpen={isLoginModalOpen}\n        isLoading={isLoading}"
);
fs.writeFileSync('src/App.tsx', appCode);

let loginCode = fs.readFileSync('src/components/LoginModal.tsx', 'utf8');
loginCode = loginCode.replace(
  "interface LoginModalProps {",
  "interface LoginModalProps {\n  isLoading?: boolean;"
);
loginCode = loginCode.replace(
  /onLoginSubmit,?\n\}\) => \{/,
  "onLoginSubmit,\n  isLoading,\n}) => {"
);
loginCode = loginCode.replace(
  /<LogIn className="w-4 h-4" \/>\n\s*<span>Masuk Aplikasi<\/span>/g,
  `{isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              <span>{isLoading ? 'Memuat...' : 'Masuk Aplikasi'}</span>`
);
// Disable button when loading
loginCode = loginCode.replace(
  /type="submit"\n\s*className="/g,
  `type="submit"
              disabled={isLoading}
              className="\${isLoading ? 'opacity-70 cursor-not-allowed' : ''} `
);
// wait, the classname had double quotes.
loginCode = loginCode.replace(
  `className="\${isLoading ? 'opacity-70 cursor-not-allowed' : ''} w-full`,
  "className={`w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center justify-center space-x-2 mt-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}"
);
// actually let's just do a clean replacement of the submit button
loginCode = loginCode.replace(
  /<button\s*type="submit"\s*className="w-full py-2\.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-blue-600\/20 flex items-center justify-center space-x-2 mt-2"\s*>\s*\{isLoading \? \([\s\S]*?<\/span>\s*<\/button>/g,
  `<button
              type="submit"
              disabled={isLoading}
              className={\`w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center justify-center space-x-2 mt-2 \${isLoading ? 'opacity-70 cursor-not-allowed' : ''}\`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              <span>{isLoading ? 'Memuat...' : 'Masuk Aplikasi'}</span>
            </button>`
);
fs.writeFileSync('src/components/LoginModal.tsx', loginCode);

