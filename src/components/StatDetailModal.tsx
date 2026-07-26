import React, { useState } from 'react';
import { Siswa, LogData } from '../types';
import { X, Users, AlertTriangle, MailCheck, ClipboardList, Search, FileText, Plus } from 'lucide-react';

interface StatDetailModalProps {
  cardType: 'TOTAL_SISWA' | 'SISWA_BERPOIN' | 'PANGGILAN_ORTU' | 'TOTAL_LOG' | null;
  onClose: () => void;
  siswaList: Siswa[];
  logs: LogData[];
  onOpenRapor: (siswa: Siswa) => void;
  onOpenAddPelanggaran: (nis: string) => void;
}

export const StatDetailModal: React.FC<StatDetailModalProps> = ({
  cardType,
  onClose,
  siswaList,
  logs,
  onOpenRapor,
  onOpenAddPelanggaran,
}) => {
  const [search, setSearch] = useState('');

  if (!cardType) return null;

  const getHeaderInfo = () => {
    switch (cardType) {
      case 'TOTAL_SISWA':
        return {
          title: 'Detail Total Siswa Terdata',
          subtitle: 'Daftar Seluruh Siswa SMAN 1 Yosowilangun yang terdaftar di sistem',
          icon: <Users className="w-6 h-6 text-blue-400" />,
          color: 'from-blue-800 to-indigo-900',
        };
      case 'SISWA_BERPOIN':
        return {
          title: 'Detail Siswa Memiliki Poin Pelanggaran',
          subtitle: 'Siswa yang pernah melakukan pelanggaran dan memiliki poin > 0',
          icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
          color: 'from-amber-800 to-orange-900',
        };
      case 'PANGGILAN_ORTU':
        return {
          title: 'Detail Siswa Panggilan Orang Tua (≥ 50 Poin)',
          subtitle: 'Daftar siswa berpoin tinggi yang memerlukan pemanggilan orang tua / wali',
          icon: <MailCheck className="w-6 h-6 text-red-400" />,
          color: 'from-red-800 to-rose-950',
        };
      case 'TOTAL_LOG':
        return {
          title: 'Detail Seluruh Log Pelanggaran & Pengurangan',
          subtitle: 'Riwayat kronologis semua peristiwa pelanggaran dan tindakan petugas',
          icon: <ClipboardList className="w-6 h-6 text-emerald-400" />,
          color: 'from-emerald-800 to-teal-950',
        };
    }
  };

  const header = getHeaderInfo();

  // Filter students or logs based on card type
  let filteredSiswa: Siswa[] = [];
  let filteredLogs: LogData[] = [];

  if (cardType === 'TOTAL_SISWA') {
    filteredSiswa = siswaList;
  } else if (cardType === 'SISWA_BERPOIN') {
    filteredSiswa = siswaList.filter((s) => s.totalPoin > 0);
  } else if (cardType === 'PANGGILAN_ORTU') {
    filteredSiswa = siswaList.filter((s) => s.totalPoin >= 50);
  } else if (cardType === 'TOTAL_LOG') {
    filteredLogs = logs;
  }

  // Apply search
  if (cardType !== 'TOTAL_LOG') {
    filteredSiswa = filteredSiswa.filter(
      (s) =>
        s.namaSiswa.toLowerCase().includes(search.toLowerCase()) ||
        s.nis.includes(search) ||
        s.kelas.toLowerCase().includes(search.toLowerCase())
    );
  } else {
    filteredLogs = filteredLogs.filter(
      (l) =>
        l.namaSiswa.toLowerCase().includes(search.toLowerCase()) ||
        l.nis.includes(search) ||
        l.jenisPelanggaran.toLowerCase().includes(search.toLowerCase()) ||
        l.namaPetugas.toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className={`bg-gradient-to-r ${header.color} text-white p-5 flex items-center justify-between shrink-0`}>
          <div className="flex items-center space-x-3">
            {header.icon}
            <div>
              <h3 className="font-bold text-base">{header.title}</h3>
              <p className="text-xs text-white/80">{header.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kata kunci, nama, NIS, kelas..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl">
            Total: {cardType === 'TOTAL_LOG' ? filteredLogs.length : filteredSiswa.length} Data
          </span>
        </div>

        {/* Content Table */}
        <div className="overflow-y-auto p-4 flex-1">
          {cardType === 'TOTAL_LOG' ? (
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-800 uppercase font-semibold text-slate-500 dark:text-slate-400 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Waktu</th>
                  <th className="py-2.5 px-3">NIS</th>
                  <th className="py-2.5 px-3">Nama Siswa</th>
                  <th className="py-2.5 px-3">Jenis Pelanggaran</th>
                  <th className="py-2.5 px-3 text-center">Poin</th>
                  <th className="py-2.5 px-3">Keterangan</th>
                  <th className="py-2.5 px-3">Petugas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Tidak ada data log yang sesuai.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-2 px-3 font-mono text-[11px]">{log.timestamp}</td>
                      <td className="py-2 px-3 font-mono">{log.nis}</td>
                      <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">{log.namaSiswa}</td>
                      <td className="py-2 px-3">{log.jenisPelanggaran}</td>
                      <td className="py-2 px-3 text-center font-bold">
                        <span className={log.poinDitambahkanDikurangi > 0 ? 'text-red-600' : 'text-emerald-600'}>
                          {log.poinDitambahkanDikurangi > 0 ? `+${log.poinDitambahkanDikurangi}` : log.poinDitambahkanDikurangi}
                        </span>
                      </td>
                      <td className="py-2 px-3">{log.keterangan}</td>
                      <td className="py-2 px-3">{log.namaPetugas}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-800 uppercase font-semibold text-slate-500 dark:text-slate-400 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">NIS</th>
                  <th className="py-2.5 px-3">Nama Siswa</th>
                  <th className="py-2.5 px-3">Kelas</th>
                  <th className="py-2.5 px-3 text-center">Total Poin</th>
                  <th className="py-2.5 px-3">Status Tindakan</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredSiswa.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Data siswa tidak ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredSiswa.map((siswa) => (
                    <tr key={siswa.nis} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-2.5 px-3 font-mono font-medium">{siswa.nis}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{siswa.namaSiswa}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-medium">
                          {siswa.kelas}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-sm">
                        <span
                          className={
                            siswa.totalPoin >= 50
                              ? 'text-red-600'
                              : siswa.totalPoin > 0
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }
                        >
                          {siswa.totalPoin}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        {siswa.totalPoin >= 100 ? (
                          <span className="px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 rounded font-bold">
                            Skorsing / SP 3
                          </span>
                        ) : siswa.totalPoin >= 50 ? (
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 rounded font-bold">
                            Panggilan Orang Tua
                          </span>
                        ) : siswa.totalPoin > 0 ? (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded font-bold">
                            Peringatan Wali Kelas
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded font-semibold">
                            Aman (0 Poin)
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => {
                              onClose();
                              onOpenRapor(siswa);
                            }}
                            className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white rounded-lg text-[11px] font-semibold hover:bg-blue-500"
                            title="Cetak Rapor PDF"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Rapor PDF</span>
                          </button>
                          <button
                            onClick={() => {
                              onClose();
                              onOpenAddPelanggaran(siswa.nis);
                            }}
                            className="p-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200"
                            title="Tambah Pelanggaran"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
