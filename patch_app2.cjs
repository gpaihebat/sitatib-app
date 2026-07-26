const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Insert loading state and change initial states
code = code.replace(
  "  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]);",
  "  const [currentUser, setCurrentUser] = useState<User | null>(null);\n  const [isLoading, setIsLoading] = useState(true);"
);

// We need to change INITIAL_* to [] for users, siswaList, etc if they weren't replaced.
code = code.replace("useState<User[]>(INITIAL_USERS)", "useState<User[]>([])");
code = code.replace("useState<Siswa[]>(INITIAL_SISWA)", "useState<Siswa[]>([])");
code = code.replace("useState<KategoriPelanggaran[]>(INITIAL_KATEGORI)", "useState<KategoriPelanggaran[]>([])");
code = code.replace("useState<LogData[]>(INITIAL_LOG)", "useState<LogData[]>([])");

fs.writeFileSync('src/App.tsx', code);
