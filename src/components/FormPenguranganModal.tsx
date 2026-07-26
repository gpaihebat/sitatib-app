import React, { useState } from 'react';
import { Siswa, User } from '../types';
import { AlertCircle, MinusCircle, CheckCircle, X } from 'lucide-react';

interface FormPenguranganModalProps {
  isOpen: boolean;
  onClose: () => void;
  siswaList: Siswa[];
  defaultNis?: string;
  currentUser: User | null;
  onSubmitPengurangan: (data: {
    nis: string;
    namaSiswa: string;
    jumlahPoin: number;
    keterangan: string;
    namaPetugas: string;
    rolePetugas: string;
  }) => void;
}

export const FormPenguranganModal: React.FC<FormPenguranganModalProps> = ({
  isOpen,
  onClose,
  siswaList,
  defaultNis = '',
  currentUser,
  onSubmitPengurangan,
}) => {
  const [selectedNis, setSelectedNis] = useState(defaultNis);
  const [jumlahPoin, setJumlahPoin] = useState<number>(10);
  const [keterangan, setKeterangan] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setSelectedNis(defaultNis);
      setJumlahPoin(10);
      setKeterangan('');
      setErrorMsg('');
    }
  }, [isOpen, defaultNis]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedNis) {
      setErrorMsg('Silakan pilih Siswa!');
      return;
    }

    if (!jumlahPoin || jumlahPoin <= 0) {
      setErrorMsg('Jumlah pengurangan poin harus lebih besar dari 0.');
      return;
    }

    if (!keterangan.trim()) {
      setErrorMsg('Alasan pengurangan poin wajib diisi!');
      return;
    }

    const targetSiswa = siswaList.find((s) => s.nis === selectedNis);
    if (!targetSiswa) {
      setErrorMsg('Data siswa tidak ditemukan.');
      return;
    }

    onSubmitPengurangan({
      nis: targetSiswa.nis,
      namaSiswa: targetSiswa.namaSiswa,
      jumlahPoin: Number(jumlahPoin),
      keterangan: keterangan.trim(),
      namaPetugas: currentUser?.nama || 'Tim Tatib',
      rolePetugas: currentUser?.role || 'TIM TATIB',
    });

    onClose();
  };

  const targetSiswaObj = siswaList.find((s) => s.nis === selectedNis);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MinusCircle className="w-6 h-6 text-emerald-200" />
            <div>
              <h3 className="font-bold text-base">Pengurangan Poin Siswa</h3>
              <p className="text-xs text-emerald-100">Fitur Khusus Tim Tatib & Admin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-emerald-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 text-xs rounded-xl border border-red-200 dark:border-red-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Select Siswa */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Pilih Siswa
            </label>
            <select
              value={selectedNis}
              onChange={(e) => setSelectedNis(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
              required
            >
              <option value="">-- Pilih Siswa --</option>
              {siswaList.map((s) => (
                <option key={s.nis} value={s.nis}>
                  {s.nis} - {s.namaSiswa} ({s.kelas}) [Total Poin: {s.totalPoin}]
                </option>
              ))}
            </select>
          </div>

          {targetSiswaObj && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs flex justify-between items-center">
              <div>
                <div className="font-semibold text-emerald-900 dark:text-emerald-200">
                  {targetSiswaObj.namaSiswa}
                </div>
                <div className="text-emerald-700 dark:text-emerald-400">
                  Total poin saat ini: <strong className="font-bold">{targetSiswaObj.totalPoin}</strong>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-600 text-white font-semibold px-2 py-1 rounded-md">
                Hasil Akhir: {Math.max(0, targetSiswaObj.totalPoin - (jumlahPoin || 0))} Poin
              </span>
            </div>
          )}

          {/* Jumlah Poin */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Jumlah Poin Dikurangi
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={jumlahPoin}
              onChange={(e) => setJumlahPoin(Number(e.target.value))}
              className="w-full py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
              required
            />
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Alasan Pengurangan / Catatan Sanksi Kebaikannya
            </label>
            <textarea
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Contoh: Siswa telah menyelesaikan sanksi kebersihan lingkungan perpustakaan & membuat surat pernyataan..."
              rows={3}
              className="w-full py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
              required
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md transition-all"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Proses Pengurangan Poin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
