const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import React, { useState } from 'react';",
  "import React, { useState, useEffect } from 'react';\nimport { apiFetch, isUsingMock } from './services/api';"
);

// We don't need INITIAL_ data imports anymore in App.tsx if they are in api.ts
code = code.replace(
  "import { INITIAL_USERS, INITIAL_SISWA, INITIAL_KATEGORI, INITIAL_LOG } from './data/initialData';",
  ""
);

// We need to add loading state
let oldStates = `  const [activeTab, setActiveTab] = useState<'simulasi' | 'gascode' | 'guide'>('simulasi');
  const [simulasiSubTab, setSimulasiSubTab] = useState<'siswa' | 'log' | 'users' | 'kategori'>('siswa');

  // Simulasi Data States
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [siswaList, setSiswaList] = useState<Siswa[]>(INITIAL_SISWA);
  const [kategoriList, setKategoriList] = useState<KategoriPelanggaran[]>(INITIAL_KATEGORI);
  const [logs, setLogs] = useState<LogData[]>(INITIAL_LOG);

  // App States
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]);`;

let newStates = `  const [activeTab, setActiveTab] = useState<'simulasi' | 'guide'>('simulasi');
  const [simulasiSubTab, setSimulasiSubTab] = useState<'siswa' | 'log' | 'users' | 'kategori'>('siswa');

  // Live Data States
  const [users, setUsers] = useState<User[]>([]);
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [kategoriList, setKategoriList] = useState<KategoriPelanggaran[]>([]);
  const [logs, setLogs] = useState<LogData[]>([]);

  // App States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);`;

code = code.replace(oldStates, newStates);

let loadDataFn = `  // Load Initial Data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch('getInitialData');
      if (res.success) {
        setSiswaList(res.siswa || []);
        setKategoriList(res.kategori || []);
        setLogs(res.logs || []);
        // Note: we might not fetch all users for security, but for now we'll just handle login.
        // Users can be managed via API, but we'll mock users if needed or just use current session.
      } else {
        showToast("Gagal memuat data dari API", 'error');
      }
    } catch (e) {
      showToast("Koneksi API bermasalah", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // If we have a user logged in, or we are in mock mode, load data.
    if (currentUser || isUsingMock) {
      loadData();
    } else {
      setIsLoading(false);
      setIsLoginModalOpen(true);
    }
  }, [currentUser]);

  // Handle Login via API
  const handleApiLogin = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await apiFetch('login', { username, password });
      if (res.success && res.user) {
        setCurrentUser(res.user);
        showToast(\`Selamat datang, \${res.user.nama}\`, 'success');
        setIsLoginModalOpen(false);
      } else {
        showToast(res.message || "Login gagal", 'error');
      }
    } catch (e) {
      showToast("Koneksi ke API bermasalah", 'error');
    } finally {
      setIsLoading(false);
    }
  };
`;

// Insert after toastMessage
code = code.replace(
  "const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);",
  "const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);\n\n" + loadDataFn
);

// Now patch the event handlers
code = code.replace(
  "const handleTambahPelanggaran = (data:",
  "const handleTambahPelanggaran = async (data:"
);
code = code.replace(
  /const newPoin = targetSiswa\.totalPoin \+ data\.poin;[\s\S]*?showToast\('Pelanggaran berhasil dicatat!', 'success'\);/g,
  `const res = await apiFetch('tambahPelanggaran', data);
    if (res.success) {
      await loadData(); // refresh data
      showToast(res.message || 'Pelanggaran berhasil dicatat!', 'success');
    } else {
      showToast(res.message || 'Gagal mencatat pelanggaran', 'error');
    }`
);

code = code.replace(
  "const handleKurangiPoin = (data:",
  "const handleKurangiPoin = async (data:"
);
code = code.replace(
  /const newPoin = Math\.max\(0, targetSiswa\.totalPoin - data\.poin\);[\s\S]*?showToast\('Poin berhasil dikurangi!', 'success'\);/g,
  `const res = await apiFetch('kurangiPelanggaran', data);
    if (res.success) {
      await loadData();
      showToast(res.message || 'Poin berhasil dikurangi!', 'success');
    } else {
      showToast(res.message || 'Gagal mengurangi poin', 'error');
    }`
);

code = code.replace(
  "const handleSaveSiswa = (siswa:",
  "const handleSaveSiswa = async (siswa:"
);
code = code.replace(
  /const isExisting = siswaList\.find[\s\S]*?showToast\('Siswa baru berhasil ditambahkan', 'success'\);\n    }/g,
  `if (action === 'DELETE') {
      showToast('Hapus siswa belum diimplementasikan di API', 'error');
    } else {
      const res = await apiFetch('tambahSiswa', siswa);
      if (res.success) {
        await loadData();
        showToast('Siswa berhasil ditambahkan', 'success');
      } else {
        showToast(res.message || 'Gagal menambah siswa', 'error');
      }
    }`
);

fs.writeFileSync('src/App.tsx', code);
