import React from 'react';
import { Siswa, LogData, User } from '../types';
import { X, Printer, GraduationCap, ShieldAlert, FileText, CheckCircle } from 'lucide-react';

interface RaporModalProps {
  isOpen: boolean;
  onClose: () => void;
  siswa: Siswa | null;
  logs: LogData[];
  currentUser: User | null;
}

export const RaporModal: React.FC<RaporModalProps> = ({
  isOpen,
  onClose,
  siswa,
  logs,
  currentUser,
}) => {
  if (!isOpen || !siswa) return null;

  // Filter logs for this specific student
  const studentLogs = logs.filter((l) => l.nis === siswa.nis);

  const getStatusSanksi = (poin: number) => {
    if (poin >= 100) {
      return {
        label: 'Surat Peringatan 3 (SP 3) & Skorsing / Panggilan Ortu 3',
        color: 'text-red-700 bg-red-100 border-red-300 dark:bg-red-950/60 dark:text-red-300',
      };
    } else if (poin >= 50) {
      return {
        label: 'Pemanggilan Orang Tua / Wali & Surat Peringatan (SP 1-2)',
        color: 'text-orange-700 bg-orange-100 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300',
      };
    } else if (poin >= 20) {
      return {
        label: 'Pembinaan & Peringatan Wali Kelas',
        color: 'text-amber-800 bg-amber-100 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300',
      };
    } else if (poin > 0) {
      return {
        label: 'Perhatian Khusus Guru Piket & Wali Kelas',
        color: 'text-blue-800 bg-blue-100 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300',
      };
    }
    return {
      label: 'Sangat Baik (0 Poin Pelanggaran)',
      color: 'text-emerald-800 bg-emerald-100 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300',
    };
  };

  const statusObj = getStatusSanksi(siswa.totalPoin);

  const handlePrint = () => {
    window.print();
  };

  const currentDateStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Toolbar Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0 border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm">Pratinjau Rapor Pelanggaran Siswa (PDF)</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="printable-rapor" className="p-6 sm:p-8 overflow-y-auto bg-white text-slate-900 print:p-0 print:overflow-visible">
          <style>{`
            @media print {
              @page {
                size: A4 portrait;
                margin: 10mm 15mm;
              }
              body * {
                visibility: hidden;
              }
              #printable-rapor, #printable-rapor * {
                visibility: visible;
              }
              #printable-rapor {
                position: absolute;
                left: 0;
                top: 0;
                width: 100% !important;
                max-width: 210mm !important;
                padding: 0 !important;
                margin: 0 !important;
                background: white !important;
                color: black !important;
                font-family: Arial, sans-serif !important;
              }
            }
          `}</style>

          {/* KOP SURAT SEKOLAH */}
          <div className="border-b-2 border-slate-900 pb-4 mb-5 text-center relative">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xl shrink-0 print:border print:border-black">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div className="text-center">
                <h4 className="text-xs uppercase tracking-wider font-bold text-slate-600">
                  Pemerintah Provinsi Jawa Timur &bull; Dinas Pendidikan
                </h4>
                <h2 className="text-lg font-extrabold text-slate-900 uppercase tracking-tight">
                  SMAN 1 YOSOWILANGUN
                </h2>
                <p className="text-[11px] text-slate-600 font-semibold">
                  SITATIB — Sistem Informasi Pelanggaran & Tata Tertib Siswa
                </p>
                <p className="text-[10px] text-slate-500 italic">
                  Jl. Raya Yosowilangun, Kabupaten Lumajang, Jawa Timur
                </p>
              </div>
            </div>
          </div>

          {/* JUDUL RAPOR */}
          <div className="text-center mb-5">
            <h3 className="text-base font-extrabold uppercase underline tracking-wide text-slate-900">
              RAPOR CATATAN POIN & TATA TERTIB SISWA
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Tanggal Cetak: {currentDateStr}</p>
          </div>

          {/* IDENTITAS SISWA */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5 text-xs">
            <div>
              <p className="text-slate-500">Nama Lengkap Siswa:</p>
              <p className="font-bold text-slate-900 text-sm">{siswa.namaSiswa}</p>
            </div>
            <div>
              <p className="text-slate-500">Nomor Induk Siswa (NIS):</p>
              <p className="font-bold text-slate-900 text-sm font-mono">{siswa.nis}</p>
            </div>
            <div>
              <p className="text-slate-500">Kelas / Rombel:</p>
              <p className="font-bold text-slate-900">{siswa.kelas}</p>
            </div>
            <div>
              <p className="text-slate-500">Wali Kelas:</p>
              <p className="font-bold text-slate-900">{siswa.waliKelas || 'Dra. Hj. Nur Aini, M.Pd.'}</p>
            </div>
            <div>
              <p className="text-slate-500">Total Akumulasi Poin:</p>
              <p className="font-extrabold text-red-600 text-sm">{siswa.totalPoin} Poin</p>
            </div>
            <div>
              <p className="text-slate-500">Status Sanksi / Pembinaan:</p>
              <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold border ${statusObj.color}`}>
                {statusObj.label}
              </span>
            </div>
          </div>

          {/* TABEL RIWAYAT PELANGGARAN */}
          <div className="mb-6">
            <h4 className="font-bold text-xs uppercase mb-2 text-slate-800 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-slate-700" />
              <span>Rincian Catatan Pelanggaran & Pengurangan Poin</span>
            </h4>
            <div className="overflow-x-auto border border-slate-300 rounded-lg">
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-slate-100 uppercase font-bold text-[11px] border-b border-slate-300">
                  <tr>
                    <th className="py-2 px-3 border-r border-slate-300 w-10 text-center">No</th>
                    <th className="py-2 px-3 border-r border-slate-300">Waktu / Tanggal</th>
                    <th className="py-2 px-3 border-r border-slate-300">Jenis Pelanggaran / Sanksi</th>
                    <th className="py-2 px-3 border-r border-slate-300 text-center">Poin</th>
                    <th className="py-2 px-3 border-r border-slate-300">Keterangan / Lokasi</th>
                    <th className="py-2 px-3">Petugas Pencatat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {studentLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-500 italic">
                        Belum ada riwayat pelanggaran tercatat. Siswa memiliki rekam jejak yang bersih.
                      </td>
                    </tr>
                  ) : (
                    studentLogs.map((log, idx) => (
                      <tr key={log.id || idx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 border-r border-slate-200 text-center font-mono">{idx + 1}</td>
                        <td className="py-2 px-3 border-r border-slate-200 font-mono text-[11px] whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="py-2 px-3 border-r border-slate-200 font-medium">
                          {log.jenisPelanggaran}
                        </td>
                        <td className="py-2 px-3 border-r border-slate-200 text-center font-bold">
                          <span
                            className={
                              log.poinDitambahkanDikurangi > 0 ? 'text-red-600' : 'text-emerald-600'
                            }
                          >
                            {log.poinDitambahkanDikurangi > 0
                              ? `+${log.poinDitambahkanDikurangi}`
                              : log.poinDitambahkanDikurangi}
                          </span>
                        </td>
                        <td className="py-2 px-3 border-r border-slate-200">{log.keterangan || '-'}</td>
                        <td className="py-2 px-3 text-slate-700">{log.namaPetugas}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* TANDA TANGAN (HANYA WALI KELAS DAN TIM TATIB / GURU BK) */}
          <div className="mt-8 pt-4 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <p className="text-slate-600 font-medium">Mengetahui,</p>
              <p className="text-slate-800 font-bold mb-1">Wali Kelas {siswa.kelas}</p>
              <div className="h-16"></div>
              <p className="font-bold underline text-slate-900">
                {siswa.waliKelas || 'Dra. Hj. Nur Aini, M.Pd.'}
              </p>
              <p className="text-[10px] text-slate-500">NIP. 19820415 200801 2 011</p>
            </div>

            <div>
              <p className="text-slate-600 font-medium">Yosowilangun, {currentDateStr}</p>
              <p className="text-slate-800 font-bold mb-1">{currentUser?.jabatan || 'Tim Tata Tertib / Guru BK'}</p>
              <div className="h-16"></div>
              <p className="font-bold underline text-slate-900">{currentUser?.nama || 'Petugas'}</p>
              {currentUser?.nip && currentUser.nip !== '-' && (
                <p className="text-[10px] text-slate-500">NIP. {currentUser.nip}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
