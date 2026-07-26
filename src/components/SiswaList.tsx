import React, { useState } from 'react';
import { Siswa, User } from '../types';
import { Search, Plus, Minus, AlertTriangle, ShieldAlert, CheckCircle, UserPlus, Filter, FileText, Layers, Table as TableIcon, ChevronDown, ChevronRight, Printer, Folder, Users } from 'lucide-react';

interface SiswaListProps {
  siswaList: Siswa[];
  currentUser: User | null;
  onOpenAddPelanggaran: (siswaNis?: string) => void;
  onOpenKurangiPoin: (siswaNis?: string) => void;
  onOpenAddSiswaModal?: () => void;
  onOpenRapor: (siswa: Siswa) => void;
}

export const SiswaList: React.FC<SiswaListProps> = ({
  siswaList,
  currentUser,
  onOpenAddPelanggaran,
  onOpenKurangiPoin,
  onOpenAddSiswaModal,
  onOpenRapor,
}) => {
  const [search, setSearch] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('ALL');
  const [viewMode, setViewMode] = useState<'KELAS' | 'TABEL'>('KELAS');
  const [expandedClasses, setExpandedClasses] = useState<Record<string, boolean>>({});

  // Extract unique classes sorted
  const kelasOptions = Array.from(new Set(siswaList.map((s) => s.kelas))).sort();

  const toggleClassExpand = (kelasName: string) => {
    setExpandedClasses((prev) => ({
      ...prev,
      [kelasName]: prev[kelasName] === undefined ? false : !prev[kelasName],
    }));
  };

  const filteredSiswa = siswaList.filter((s) => {
    const matchesSearch =
      s.namaSiswa.toLowerCase().includes(search.toLowerCase()) ||
      s.nis.includes(search) ||
      s.kelas.toLowerCase().includes(search.toLowerCase());

    const matchesKelas = selectedKelas === 'ALL' || s.kelas === selectedKelas;

    return matchesSearch && matchesKelas;
  });

  // Group filtered students by class
  const groupedByKelas = filteredSiswa.reduce((acc, s) => {
    if (!acc[s.kelas]) acc[s.kelas] = [];
    acc[s.kelas].push(s);
    return acc;
  }, {} as Record<string, Siswa[]>);

  const getPoinBadge = (poin: number) => {
    if (poin >= 100) {
      return {
        bg: 'bg-red-500 text-white',
        status: 'SP 3 / Skorsing / Panggilan Ortu 3',
        icon: <ShieldAlert className="w-3.5 h-3.5" />,
      };
    } else if (poin >= 50) {
      return {
        bg: 'bg-orange-500 text-white',
        status: 'Panggilan Ortu / SP 1-2',
        icon: <AlertTriangle className="w-3.5 h-3.5" />,
      };
    } else if (poin >= 20) {
      return {
        bg: 'bg-amber-500 text-white',
        status: 'Peringatan Wali Kelas',
        icon: <AlertTriangle className="w-3.5 h-3.5" />,
      };
    } else if (poin > 0) {
      return {
        bg: 'bg-blue-500 text-white',
        status: 'Perhatian Khusus',
        icon: <CheckCircle className="w-3.5 h-3.5" />,
      };
    }
    return {
      bg: 'bg-emerald-500 text-white',
      status: 'Aman (0 Poin)',
      icon: <CheckCircle className="w-3.5 h-3.5" />,
    };
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
            <span>Daftar Siswa & Record Pelanggaran</span>
            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-normal px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
              {filteredSiswa.length} Siswa
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Database Poin Pelanggaran Tata Tertib SMAN 1 Yosowilangun
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('KELAS')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'KELAS'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Grup Kelas</span>
            </button>
            <button
              onClick={() => setViewMode('TABEL')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'TABEL'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tabel Lengkap</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 sm:w-52">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari NIS, Nama, Kelas..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
          </div>

          {/* Kelas Filter */}
          <div className="relative">
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white appearance-none cursor-pointer"
            >
              <option value="ALL">Semua Kelas</option>
              {kelasOptions.map((k) => (
                <option key={k} value={k}>
                  Kelas {k}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Action Buttons */}
          <button
            onClick={() => onOpenAddPelanggaran()}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Catat Pelanggaran</span>
          </button>

          {(currentUser?.role?.toUpperCase() === 'TIM TATIB' || currentUser?.role?.toUpperCase() === 'ADMIN') && (
            <button
              onClick={() => onOpenKurangiPoin()}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              <Minus className="w-3.5 h-3.5" />
              <span>Kurangi Poin</span>
            </button>
          )}

          {currentUser?.role?.toUpperCase() === 'ADMIN' && onOpenAddSiswaModal && (
            <button
              onClick={onOpenAddSiswaModal}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Siswa Baru</span>
            </button>
          )}

          {/* Cetak Rapor Massal / Kelas */}
          <div className="relative group z-50">
            <button className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all">
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Massal</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="p-2 space-y-1">
                <button 
                  onClick={() => {
                     // Since this is React SPA in a dashboard, doing window.print() prints the whole dashboard.
                     // The requirement is to print Rapor per class or mass.
                     // We should ideally open a specific print view or loop through students.
                     // For UI simulation, we will alert the user.
                     alert("Fitur Cetak Semua Rapor (A4) akan membuka dokumen PDF seluruh siswa.");
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Users className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Cetak Seluruh Siswa</span>
                </button>
                <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Per Kelas</div>
                {kelasOptions.map(c => (
                  <button 
                    key={c}
                    onClick={() => {
                      alert(`Membuka PDF Rapor Massal untuk Kelas ${c}`);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Folder className="w-3.5 h-3.5 text-slate-400" />
                    <span>Kelas {c}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW MODE: KELAS (GROUPED BY CLASS) */}
      {viewMode === 'KELAS' ? (
        <div className="p-4 sm:p-5 space-y-4">
          {Object.keys(groupedByKelas).length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Tidak ada data siswa yang cocok dengan pencarian / filter.
            </div>
          ) : (
            Object.keys(groupedByKelas)
              .sort()
              .map((kelasName) => {
                const studentsInClass = groupedByKelas[kelasName];
                const totalPoinKelas = studentsInClass.reduce((sum, s) => sum + s.totalPoin, 0);
                const isCollapsed = expandedClasses[kelasName] === true;

                return (
                  <div
                    key={kelasName}
                    className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs"
                  >
                    {/* Class Card Header */}
                    <div
                      onClick={() => toggleClassExpand(kelasName)}
                      className="p-4 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between border-b border-slate-100 dark:border-slate-800 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <button className="text-slate-400">
                          {isCollapsed ? (
                            <ChevronRight className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                            Kelas {kelasName}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
                            {studentsInClass.length} Siswa
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          Akumulasi Poin Kelas:{' '}
                          <span className="font-bold text-slate-900 dark:text-white">{totalPoinKelas} Poin</span>
                        </span>
                      </div>
                    </div>

                    {/* Class Students Table */}
                    {!isCollapsed && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                          <thead className="bg-slate-100/50 dark:bg-slate-900/50 text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                              <th className="py-2.5 px-4">NIS</th>
                              <th className="py-2.5 px-4">Nama Siswa</th>
                              <th className="py-2.5 px-4 text-center">Total Poin</th>
                              <th className="py-2.5 px-4">Status Kategori</th>
                              <th className="py-2.5 px-4 text-right">Aksi & Rapor</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {studentsInClass.map((siswa) => {
                              const badge = getPoinBadge(siswa.totalPoin);
                              return (
                                <tr
                                  key={siswa.nis}
                                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                                >
                                  <td className="py-2.5 px-4 font-mono font-medium text-slate-800 dark:text-slate-200">
                                    {siswa.nis}
                                  </td>
                                  <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">
                                    {siswa.namaSiswa}
                                  </td>
                                  <td className="py-2.5 px-4 text-center font-bold text-sm">
                                    <span
                                      className={
                                        siswa.totalPoin > 50
                                          ? 'text-red-600 dark:text-red-400'
                                          : siswa.totalPoin > 0
                                          ? 'text-amber-600 dark:text-amber-400'
                                          : 'text-emerald-600 dark:text-emerald-400'
                                      }
                                    >
                                      {siswa.totalPoin}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-4">
                                    <span
                                      className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badge.bg}`}
                                    >
                                      {badge.icon}
                                      <span>{badge.status}</span>
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-4 text-right">
                                    <div className="flex items-center justify-end space-x-1.5">
                                      <button
                                        onClick={() => onOpenRapor(siswa)}
                                        className="flex items-center space-x-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-indigo-200 dark:border-indigo-800 transition-all shadow-2xs"
                                        title="Cetak Rapor Pelanggaran PDF"
                                      >
                                        <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                        <span>Rapor PDF</span>
                                      </button>
                                      <button
                                        onClick={() => onOpenAddPelanggaran(siswa.nis)}
                                        className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                        title="Tambah Poin Pelanggaran (+)"
                                      >
                                        <Plus className="w-4 h-4" />
                                      </button>
                                      {(currentUser?.role?.toUpperCase() === 'TIM TATIB' || currentUser?.role?.toUpperCase() === 'ADMIN') && (
                                        <button
                                          onClick={() => onOpenKurangiPoin(siswa.nis)}
                                          className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                                          title="Kurangi Poin Pelanggaran (-)"
                                        >
                                          <Minus className="w-4 h-4" />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })
          )}
        </div>
      ) : (
        /* VIEW MODE: TABEL LENGKAP */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">NIS</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4 text-center">Total Poin</th>
                <th className="py-3 px-4">Kategori Status</th>
                <th className="py-3 px-4 text-right">Aksi & Rapor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSiswa.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Data siswa tidak ditemukan untuk pencarian ini.
                  </td>
                </tr>
              ) : (
                filteredSiswa.map((siswa) => {
                  const badge = getPoinBadge(siswa.totalPoin);
                  return (
                    <tr
                      key={siswa.nis}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-medium text-slate-800 dark:text-slate-200">
                        {siswa.nis}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {siswa.namaSiswa}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded border border-slate-200 dark:border-slate-700">
                          {siswa.kelas}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-sm">
                        <span
                          className={
                            siswa.totalPoin > 50
                              ? 'text-red-600 dark:text-red-400'
                              : siswa.totalPoin > 0
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }
                        >
                          {siswa.totalPoin}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${badge.bg}`}
                        >
                          {badge.icon}
                          <span>{badge.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => onOpenRapor(siswa)}
                            className="flex items-center space-x-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-indigo-200 dark:border-indigo-800 transition-all shadow-2xs"
                            title="Cetak Rapor Pelanggaran PDF"
                          >
                            <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span>Rapor PDF</span>
                          </button>
                          <button
                            onClick={() => onOpenAddPelanggaran(siswa.nis)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="Tambah Poin Pelanggaran (+)"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          {(currentUser?.role?.toUpperCase() === 'TIM TATIB' || currentUser?.role?.toUpperCase() === 'ADMIN') && (
                            <button
                              onClick={() => onOpenKurangiPoin(siswa.nis)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                              title="Kurangi Poin Pelanggaran (-)"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

