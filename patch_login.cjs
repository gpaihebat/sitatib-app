const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(
  /onLoginSuccess=\{\(u\) => \{[\s\S]*?\}\}/g,
  "onLoginSubmit={(username, password) => handleApiLogin(username, password)}"
);
fs.writeFileSync('src/App.tsx', appCode);

let loginCode = fs.readFileSync('src/components/LoginModal.tsx', 'utf8');
loginCode = loginCode.replace(
  "onLoginSuccess: (user: User) => void;",
  "onLoginSubmit: (u: string, p: string) => void;"
);
loginCode = loginCode.replace(
  "users,",
  ""
);
loginCode = loginCode.replace(
  "onLoginSuccess,",
  "onLoginSubmit,"
);
loginCode = loginCode.replace(
  /const handleSubmit = \(e: React\.FormEvent\) => \{[\s\S]*?\}\s*\};\s*const handleQuickFill/g,
  `const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    onLoginSubmit(username.trim(), password.trim());
  };

  const handleQuickFill`
);
fs.writeFileSync('src/components/LoginModal.tsx', loginCode);

