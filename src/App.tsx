import React, { useState, useEffect } from 'react';
import { apiFetch, isUsingMock } from './services/api';
import { User, Siswa, KategoriPelanggaran, LogData, Role } from './types';
import {
  INITIAL_USERS,
  INITIAL_SISWA,
  INITIAL_KATEGORI,
  INITIAL_LOG,
} from './data/initialData';
import { Header } from './components/Header';
import { LoginModal } from './components/LoginModal';
import { SiswaList } from './components/SiswaList';
import { FormPelanggaranModal } from './components/FormPelanggaranModal';
import { FormPenguranganModal } from './components/FormPenguranganModal';
import { LogDataView } from './components/LogDataView';
import { AdminUsersView } from './components/AdminUsersView';
import { AdminKategoriView } from './components/AdminKategoriView';
import { AdminSiswaModal } from './components/AdminSiswaModal';
import { RaporModal } from './components/RaporModal';
import { StatDetailModal } from './components/StatDetailModal';
import { GasCodeViewer } from './components/GasCodeViewer';
import { PanduanSetupView } from './components/PanduanSetupView';

import {
  Users,
  AlertTriangle,
  MailCheck,
  ClipboardList,
  Plus,
  Minus,
  CheckCircle,
  Shield,
  ListFilter,
  UserCheck,
  GraduationCap,
} from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'simulasi' | 'gascode' | 'guide'>('simulasi');
  const [simulasiSubTab, setSimulasiSubTab] = useState<'siswa' | 'log' | 'users' | 'kategori'>('siswa');

  // Application Data State
  const [users, setUsers] = useState<User[]>([]);
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [kategoriList, setKategoriList] = useState<KategoriPelanggaran[]>([]);
  const [logs, setLogs] = useState<LogData[]>([]);

  // Authentication State (Default: Logged in as Admin for easy evaluation)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Modals
  const [isPelanggaranModalOpen, setIsPelanggaranModalOpen] = useState(false);
  const [isPenguranganModalOpen, setIsPenguranganModalOpen] = useState(false);
  const [isAddSiswaModalOpen, setIsAddSiswaModalOpen] = useState(false);
  const [targetSiswaNis, setTargetSiswaNis] = useState<string>('');

  // Rapor & Stat Detail Modals
  const [activeRaporSiswa, setActiveRaporSiswa] = useState<Siswa | null>(null);
  const [statCardModalType, setStatCardModalType] = useState<'TOTAL_SISWA' | 'SISWA_BERPOIN' | 'PANGGILAN_ORTU' | 'TOTAL_LOG' | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Load Initial Data
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
        showToast(`Selamat datang, ${res.user.nama}`, 'success');
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


  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 1. TAMBAH POIN PELANGGARAN
  const handleTambahPelanggaran = async (data: {
    nis: string;
    namaSiswa: string;
    jenisPelanggaran: string;
    bobotPoin: number;
    keterangan: string;
    namaPetugas: string;
    rolePetugas: string;
  }) => {
    setSiswaList((prev) =>
      prev.map((s) => (s.nis === data.nis ? { ...s, totalPoin: s.totalPoin + data.bobotPoin } : s))
    );

    const newLog: LogData = {
      id: 'LOG' + (logs.length + 101),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      nis: data.nis,
      namaSiswa: data.namaSiswa,
      jenisPelanggaran: data.jenisPelanggaran,
      poinDitambahkanDikurangi: data.bobotPoin,
      keterangan: data.keterangan,
      namaPetugas: data.namaPetugas,
      rolePetugas: data.rolePetugas as Role,
    };
    setLogs((prev) => [newLog, ...prev]);

    try {
      const res = await apiFetch('tambahPelanggaran', {
        nis: data.nis,
        namaSiswa: data.namaSiswa,
        jenisPelanggaran: data.jenisPelanggaran,
        poin: data.bobotPoin,
        keterangan: data.keterangan,
        namaPetugas: data.namaPetugas,
        rolePetugas: data.rolePetugas
      });
      
      if (res.success) {
        showToast(`Berhasil menambahkan ${data.bobotPoin} poin untuk ${data.namaSiswa}.`);
      } else {
        showToast("Gagal menyimpan ke database: " + res.message, 'error');
      }
    } catch (error) {
      showToast("Koneksi API bermasalah", 'error');
    }
  };

  // 2. KURANGI POIN PELANGGARAN (TIM TATIB & ADMIN)
  const handleKurangiPoin = async (data: {
    nis: string;
    namaSiswa: string;
    jumlahPoin: number;
    keterangan: string;
    namaPetugas: string;
    rolePetugas: string;
  }) => {
    if (currentUser?.role === 'GURU') {
      showToast('Akses ditolak! Role GURU tidak memiliki wewenang mengurangi poin.', 'error');
      return;
    }

    setSiswaList((prev) =>
      prev.map((s) => (s.nis === data.nis ? { ...s, totalPoin: Math.max(0, s.totalPoin - data.jumlahPoin) } : s))
    );

    const newLog: LogData = {
      id: 'LOG' + (logs.length + 101),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      nis: data.nis,
      namaSiswa: data.namaSiswa,
      jenisPelanggaran: 'Pengurangan Poin / Sanksi Selesai',
      poinDitambahkanDikurangi: -Math.abs(data.jumlahPoin),
      keterangan: data.keterangan,
      namaPetugas: data.namaPetugas,
      rolePetugas: data.rolePetugas as Role,
    };
    setLogs((prev) => [newLog, ...prev]);

    try {
      const res = await apiFetch('kurangiPelanggaran', {
        nis: data.nis,
        namaSiswa: data.namaSiswa,
        poin: data.jumlahPoin,
        keterangan: data.keterangan,
        namaPetugas: data.namaPetugas,
        rolePetugas: data.rolePetugas
      });
      
      if (res.success) {
        showToast(`Berhasil mengurangi ${data.jumlahPoin} poin untuk ${data.namaSiswa}.`);
      } else {
        showToast("Gagal menyimpan ke database: " + res.message, 'error');
      }
    } catch (error) {
      showToast("Koneksi API bermasalah", 'error');
    }
  };

  // 3. ADMIN: CRUD USER
  const handleSaveUser = (user: User, action: 'SAVE' | 'DELETE') => {
    if (action === 'DELETE') {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      showToast(`User ${user.nama} telah dihapus.`);
    } else {
      setUsers((prev) => {
        const exists = prev.some((u) => u.id === user.id);
        if (exists) {
          return prev.map((u) => (u.id === user.id ? user : u));
        }
        return [...prev, user];
      });
      showToast(`User ${user.nama} (${user.role}) berhasil disimpan.`);
    }
  };

  // 4. ADMIN: CRUD KATEGORI
  const handleSaveKategori = (kategori: KategoriPelanggaran, action: 'SAVE' | 'DELETE') => {
    if (action === 'DELETE') {
      setKategoriList((prev) => prev.filter((k) => k.idPelanggaran !== kategori.idPelanggaran));
      showToast(`Kategori ${kategori.namaPelanggaran} dihapus.`);
    } else {
      setKategoriList((prev) => {
        const exists = prev.some((k) => k.idPelanggaran === kategori.idPelanggaran);
        if (exists) {
          return prev.map((k) => (k.idPelanggaran === kategori.idPelanggaran ? kategori : k));
        }
        return [...prev, kategori];
      });
      showToast(`Kategori pelanggaran "${kategori.namaPelanggaran}" berhasil disimpan.`);
    }
  };

  // 5. ADMIN: CRUD SISWA
  const handleSaveSiswa = async (siswa: Siswa, action: 'SAVE' | 'DELETE') => {
    if (action === 'DELETE') {
      setSiswaList((prev) => prev.filter((s) => s.nis !== siswa.nis));
      showToast(`Siswa ${siswa.namaSiswa} telah dihapus.`);
    } else {
      setSiswaList((prev) => {
        const exists = prev.some((s) => s.nis === siswa.nis);
        if (exists) {
          return prev.map((s) => (s.nis === siswa.nis ? siswa : s));
        }
        return [...prev, siswa];
      });
      showToast(`Data siswa ${siswa.namaSiswa} (${siswa.kelas}) berhasil disimpan.`);
    }
  };

  // Calculate statistics
  const totalSiswa = siswaList.length;
  const siswaMelanggar = siswaList.filter((s) => s.totalPoin > 0).length;
  const panggilanOrtu = siswaList.filter((s) => s.totalPoin >= 50).length;
  const totalLogsCount = logs.length;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 flex flex-col antialiased">
      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          showToast('Anda telah keluar dari aplikasi.');
        }}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center space-x-2 border ${
              toastMessage.type === 'error'
                ? 'bg-red-600 text-white border-red-500'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'gascode' ? (
          <GasCodeViewer />
        ) : activeTab === 'guide' ? (
          <PanduanSetupView />
        ) : (
          /* Live Interactive App Simulator */
          <div className="space-y-6">
            {/* Top Stat Cards (Beautified) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-2 relative z-10">
              <div
                onClick={() => setStatCardModalType('TOTAL_SISWA')}
                className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-slate-800 p-5 rounded-3xl border-0 shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all flex flex-col group relative overflow-hidden"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 blur-2xl"></div>
                <div className="flex items-center justify-between z-10">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Total Siswa Terdata
                    </p>
                    <h4 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">{totalSiswa}</h4>
                    <div className="mt-3 inline-flex items-center px-2 py-1 rounded-full bg-blue-100/50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                      Klik untuk detail &rarr;
                    </div>
                  </div>
                  <div className="p-3.5 bg-gradient-to-br from-blue-500 to-cyan-400 text-white rounded-2xl shadow-lg shadow-blue-500/30 group-hover:rotate-6 transition-transform">
                    <Users className="w-7 h-7" />
                  </div>
                </div>
              </div>

              <div
                onClick={() => setStatCardModalType('SISWA_BERPOIN')}
                className="bg-gradient-to-br from-white to-amber-50 dark:from-slate-900 dark:to-slate-800 p-5 rounded-3xl border-0 shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all flex flex-col group relative overflow-hidden"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 blur-2xl"></div>
                <div className="flex items-center justify-between z-10">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Siswa Memiliki Poin
                    </p>
                    <h4 className="text-3xl font-extrabold text-amber-500 dark:text-amber-400 mt-2">{siswaMelanggar}</h4>
                    <div className="mt-3 inline-flex items-center px-2 py-1 rounded-full bg-amber-100/50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                      Klik untuk detail &rarr;
                    </div>
                  </div>
                  <div className="p-3.5 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl shadow-lg shadow-amber-500/30 group-hover:rotate-6 transition-transform">
                    <AlertTriangle className="w-7 h-7" />
                  </div>
                </div>
              </div>

              <div
                onClick={() => setStatCardModalType('PANGGILAN_ORTU')}
                className="bg-gradient-to-br from-white to-red-50 dark:from-slate-900 dark:to-slate-800 p-5 rounded-3xl border-0 shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all flex flex-col group relative overflow-hidden"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 blur-2xl"></div>
                <div className="flex items-center justify-between z-10">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Panggilan Ortu (&ge;50)
                    </p>
                    <h4 className="text-3xl font-extrabold text-red-600 dark:text-red-400 mt-2">{panggilanOrtu}</h4>
                    <div className="mt-3 inline-flex items-center px-2 py-1 rounded-full bg-red-100/50 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-[10px] font-bold">
                      Klik daftar panggilan &rarr;
                    </div>
                  </div>
                  <div className="p-3.5 bg-gradient-to-br from-red-500 to-rose-500 text-white rounded-2xl shadow-lg shadow-red-500/30 group-hover:rotate-6 transition-transform">
                    <MailCheck className="w-7 h-7" />
                  </div>
                </div>
              </div>

              <div
                onClick={() => setStatCardModalType('TOTAL_LOG')}
                className="bg-gradient-to-br from-white to-emerald-50 dark:from-slate-900 dark:to-slate-800 p-5 rounded-3xl border-0 shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all flex flex-col group relative overflow-hidden"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 blur-2xl"></div>
                <div className="flex items-center justify-between z-10">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Total Pelanggaran
                    </p>
                    <h4 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">{totalLogsCount}</h4>
                    <div className="mt-3 inline-flex items-center px-2 py-1 rounded-full bg-emerald-100/50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                      Klik log aktivitas &rarr;
                    </div>
                  </div>
                  <div className="p-3.5 bg-gradient-to-br from-emerald-500 to-teal-400 text-white rounded-2xl shadow-lg shadow-emerald-500/30 group-hover:rotate-6 transition-transform">
                    <ClipboardList className="w-7 h-7" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Navigation Tabs based on Role */}
            <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-1 overflow-x-auto py-1">
                <button
                  onClick={() => setSimulasiSubTab('siswa')}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    simulasiSubTab === 'siswa'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Daftar Siswa</span>
                </button>

                <button
                  onClick={() => setSimulasiSubTab('log')}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    simulasiSubTab === 'log'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Log Aktivitas</span>
                </button>

                {currentUser?.role === 'ADMIN' && (
                  <>
                    <button
                      onClick={() => setSimulasiSubTab('users')}
                      className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        simulasiSubTab === 'users'
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Kelola User</span>
                    </button>

                    <button
                      onClick={() => setSimulasiSubTab('kategori')}
                      className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        simulasiSubTab === 'kategori'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <ListFilter className="w-3.5 h-3.5" />
                      <span>Kelola Kategori</span>
                    </button>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setTargetSiswaNis('');
                    setIsPelanggaranModalOpen(true);
                  }}
                  className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Catat Pelanggaran</span>
                </button>

                {(currentUser?.role === 'TIM TATIB' || currentUser?.role === 'ADMIN') && (
                  <button
                    onClick={() => {
                      setTargetSiswaNis('');
                      setIsPenguranganModalOpen(true);
                    }}
                    className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all"
                  >
                    <Minus className="w-3.5 h-3.5" />
                    <span>Kurangi Poin</span>
                  </button>
                )}
              </div>
            </div>

            {/* Selected View Tab Content */}
            {simulasiSubTab === 'siswa' && (
              <SiswaList
                siswaList={siswaList}
                currentUser={currentUser}
                onOpenAddPelanggaran={(nis) => {
                  setTargetSiswaNis(nis || '');
                  setIsPelanggaranModalOpen(true);
                }}
                onOpenKurangiPoin={(nis) => {
                  setTargetSiswaNis(nis || '');
                  setIsPenguranganModalOpen(true);
                }}
                onOpenAddSiswaModal={() => setIsAddSiswaModalOpen(true)}
                onOpenRapor={(siswa) => setActiveRaporSiswa(siswa)}
              />
            )}

            {simulasiSubTab === 'log' && <LogDataView logs={logs} />}

            {simulasiSubTab === 'users' && (
              <AdminUsersView  onSaveUser={handleSaveUser} />
            )}

            {simulasiSubTab === 'kategori' && (
              <AdminKategoriView
                kategoriList={kategoriList}
                onSaveKategori={handleSaveKategori}
              />
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        isLoading={isLoading}
        onClose={() => setIsLoginModalOpen(false)}
        
        onLoginSubmit={(username, password) => handleApiLogin(username, password)}
      />

      <FormPelanggaranModal
        isOpen={isPelanggaranModalOpen}
        onClose={() => setIsPelanggaranModalOpen(false)}
        siswaList={siswaList}
        kategoriList={kategoriList}
        defaultNis={targetSiswaNis}
        currentUser={currentUser}
        onSubmitPelanggaran={handleTambahPelanggaran}
      />

      <FormPenguranganModal
        isOpen={isPenguranganModalOpen}
        onClose={() => setIsPenguranganModalOpen(false)}
        siswaList={siswaList}
        defaultNis={targetSiswaNis}
        currentUser={currentUser}
        onSubmitPengurangan={handleKurangiPoin}
      />

      <AdminSiswaModal
        isOpen={isAddSiswaModalOpen}
        onClose={() => setIsAddSiswaModalOpen(false)}
        onSaveSiswa={handleSaveSiswa}
      />

      <RaporModal
        isOpen={!!activeRaporSiswa}
        onClose={() => setActiveRaporSiswa(null)}
        siswa={activeRaporSiswa}
        logs={logs}
        currentUser={currentUser}
      />

      <StatDetailModal
        cardType={statCardModalType}
        onClose={() => setStatCardModalType(null)}
        siswaList={siswaList}
        logs={logs}
        onOpenRapor={(siswa) => setActiveRaporSiswa(siswa)}
        onOpenAddPelanggaran={(nis) => {
          setTargetSiswaNis(nis || '');
          setIsPelanggaranModalOpen(true);
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>SITATIB SMAN 1 Yosowilangun &copy; 2026 — Google Apps Script & Google Sheets Integration</p>
      </footer>
    </div>
  );
}
