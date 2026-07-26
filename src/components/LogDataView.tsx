import React, { useState } from 'react';
import { LogData } from '../types';
import { Search, Clock, Download, FileText, UserCheck, ShieldCheck } from 'lucide-react';

interface LogDataViewProps {
  logs: LogData[];
}

export const LogDataView: React.FC<LogDataViewProps> = ({ logs }) => {
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter((log) => {
    const text = (
      log.namaSiswa +
      log.nis +
      log.jenisPelanggaran +
      log.keterangan +
      log.namaPetugas +
      log.rolePetugas
    ).toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const exportCSV = () => {
    const headers = [
      'Timestamp',
      'NIS',
      'Nama Siswa',
      'Jenis Pelanggaran / Sanksi',
      'Poin',
      'Keterangan',
      'Nama Petugas',
      'Role Petugas',
    ];

    const rows = logs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.nis}"`,
      `"${l.namaSiswa}"`,
      `"${l.jenisPelanggaran}"`,
      l.poinDitambahkanDikurangi,
      `"${l.keterangan}"`,
      `"${l.namaPetugas}"`,
      `"${l.rolePetugas}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SITATAB_LogPelanggaran_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>Log Aktivitas & Riwayat Pelanggaran</span>
            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-normal px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
              {logs.length} Catatan
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit Trail Real-time Penginputan & Pengurangan Poin oleh Petugas
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari log..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all text-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3 px-4">Waktu</th>
              <th className="py-3 px-4">NIS</th>
              <th className="py-3 px-4">Nama Siswa</th>
              <th className="py-3 px-4">Jenis Pelanggaran / Sanksi</th>
              <th className="py-3 px-4 text-center">Poin</th>
              <th className="py-3 px-4">Keterangan</th>
              <th className="py-3 px-4">Petugas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  Belum ada catatan log aktivitas.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, idx) => {
                const isReduction = log.poinDitambahkanDikurangi < 0;
                return (
                  <tr
                    key={log.id || idx}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4 font-mono">{log.nis}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {log.namaSiswa}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {log.jenisPelanggaran}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold">
                      {isReduction ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                          {log.poinDitambahkanDikurangi}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 font-bold border border-red-200 dark:border-red-800">
                          +{log.poinDitambahkanDikurangi}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                      {log.keterangan || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1 text-slate-700 dark:text-slate-300">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium">{log.namaPetugas}</span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 font-mono">
                          {log.rolePetugas}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
