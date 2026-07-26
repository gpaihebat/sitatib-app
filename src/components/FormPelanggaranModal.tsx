import React, { useState } from 'react';
import { Siswa, KategoriPelanggaran, User } from '../types';
import { AlertCircle, Save, X, PlusCircle, Search, CheckCircle2, ShieldAlert } from 'lucide-react';

interface FormPelanggaranModalProps {
  isOpen: boolean;
  onClose: () => void;
  siswaList: Siswa[];
  kategoriList: KategoriPelanggaran[];
  defaultNis?: string;
  currentUser: User | null;
  onSubmitPelanggaran: (data: {
    nis: string;
    namaSiswa: string;
    jenisPelanggaran: string;
    bobotPoin: number;
    keterangan: string;
    namaPetugas: string;
    rolePetugas: string;
  }) => void;
}

export const FormPelanggaranModal: React.FC<FormPelanggaranModalProps> = ({
  isOpen,
  onClose,
  siswaList,
  kategoriList,
  defaultNis = '',
  currentUser,
  onSubmitPelanggaran,
}) => {
  const [selectedNis, setSelectedNis] = useState(defaultNis);
  const [selectedKategoriId, setSelectedKategoriId] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Synchronize defaultNis when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedNis(defaultNis);
      setSelectedKategoriId('');
      setCategorySearch('');
      setKeterangan('');
      setErrorMsg('');
    }
  }, [isOpen, defaultNis]);

  if (!isOpen) return null;

  // Filter categories by keyword
  const filteredKategori = kategoriList.filter((k) => {
    const q = categorySearch.toLowerCase().trim();
    if (!q) return true;
    return (
      k.namaPelanggaran.toLowerCase().includes(q) ||
      k.idPelanggaran.toLowerCase().includes(q) ||
      (k.keterangan && k.keterangan.toLowerCase().includes(q))
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedNis) {
      setErrorMsg('Silakan pilih Siswa!');
      return;
    }

    if (!selectedKategoriId) {
      setErrorMsg('Silakan pilih Kategori Pelanggaran!');
      return;
    }

    const targetSiswa = siswaList.find((s) => s.nis === selectedNis);
    const targetKategori = kategoriList.find((k) => k.idPelanggaran === selectedKategoriId);

    if (!targetSiswa || !targetKategori) {
      setErrorMsg('Data siswa atau kategori tidak valid.');
      return;
    }

    onSubmitPelanggaran({
      nis: targetSiswa.nis,
      namaSiswa: targetSiswa.namaSiswa,
      jenisPelanggaran: targetKategori.namaPelanggaran,
      bobotPoin: targetKategori.bobotPoin,
      keterangan: keterangan.trim() || targetKategori.keterangan || 'Pelanggaran dicatat oleh ' + (currentUser?.nama || 'Petugas'),
      namaPetugas: currentUser?.nama || 'Petugas Piket',
      rolePetugas: currentUser?.role || 'GURU',
    });

    onClose();
  };

  const selectedKategoriObj = kategoriList.find((k) => k.idPelanggaran === selectedKategoriId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <PlusCircle className="w-6 h-6 text-blue-200" />
            <div>
              <h3 className="font-bold text-base">Catat Pelanggaran Siswa</h3>
              <p className="text-xs text-blue-200">Form Input Poin Pelanggaran Tata Tertib</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-blue-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 text-xs rounded-xl border border-red-200 dark:border-red-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Select Siswa */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Pilih Siswa (NIS - Nama - Kelas)
            </label>
            <select
              value={selectedNis}
              onChange={(e) => setSelectedNis(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
              required
            >
              <option value="">-- Pilih Siswa --</option>
              {siswaList.map((s) => (
                <option key={s.nis} value={s.nis}>
                  {s.nis} - {s.namaSiswa} ({s.kelas}) [Poin Saat Ini: {s.totalPoin}]
                </option>
              ))}
            </select>
          </div>

          {/* Search Pelanggaran Keyword */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Pilih Jenis Pelanggaran
              </label>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                Cari kata kunci tanpa hafal kode
              </span>
            </div>

            {/* Keyword Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="Cari kata kunci (contoh: HP, Terlambat, Merokok, Bolos, Seragam...)"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
              />
            </div>

            {/* Dropdown Select filtered by Search */}
            <select
              value={selectedKategoriId}
              onChange={(e) => setSelectedKategoriId(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
              required
            >
              <option value="">
                {categorySearch ? `-- Hasil Pencarian (${filteredKategori.length}) --` : '-- Pilih Jenis Pelanggaran --'}
              </option>
              {filteredKategori.map((k) => (
                <option key={k.idPelanggaran} value={k.idPelanggaran}>
                  [{k.bobotPoin} Poin] {k.namaPelanggaran}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Category Details & Sanction Action Preview */}
          {selectedKategoriObj && (
            <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  {selectedKategoriObj.namaPelanggaran}
                </span>
                <span className="px-2.5 py-0.5 bg-blue-600 text-white font-bold rounded-full text-xs shrink-0">
                  +{selectedKategoriObj.bobotPoin} Poin
                </span>
              </div>
              {selectedKategoriObj.keterangan && (
                <div className="pt-1 border-t border-blue-200/60 dark:border-blue-800/60 text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-slate-800 dark:text-slate-200">Tindakan / Sanksi: </span>
                    <span>{selectedKategoriObj.keterangan}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Keterangan Detail Event */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Catatan Lokasi / Detail Pelanggaran
            </label>
            <textarea
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder={selectedKategoriObj?.keterangan || "Contoh: Terlambat jam ke-1 di gerbang depan, berada di luar area kelas..."}
              rows={2}
              className="w-full py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
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
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Poin Pelanggaran</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
