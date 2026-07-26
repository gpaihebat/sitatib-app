const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

code = code.replace(
  /!\(currentUser \|\| currentUser\.role === 'ADMIN'\)/g,
  "!currentUser || currentUser.role.toUpperCase() === 'ADMIN'"
);

code = code.replace(
  /\(!currentUser \|\| currentUser\.role === 'ADMIN'\)/g,
  "(!currentUser || currentUser.role.toUpperCase() === 'ADMIN')"
);

code = code.replace(
  /switch \(role\)/g,
  "switch (role?.toUpperCase())"
);

fs.writeFileSync('src/components/Header.tsx', code);
