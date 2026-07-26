import React, { useState } from 'react';
import { Siswa } from '../types';
import { UserPlus, X, Save } from 'lucide-react';

interface AdminSiswaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSiswa: (siswa: Siswa, action: 'SAVE' | 'DELETE') => void;
  editingSiswa?: Siswa | null;
}

export const AdminSiswaModal: React.FC<AdminSiswaModalProps> = ({
  isOpen,
  onClose,
  onSaveSiswa,
  editingSiswa,
}) => {
  const [nis, setNis] = useState('');
  const [namaSiswa, setNamaSiswa] = useState('');
  const [kelas, setKelas] = useState('X-1');
  const [totalPoin, setTotalPoin] = useState<number>(0);

  React.useEffect(() => {
    if (isOpen) {
      if (editingSiswa) {
        setNis(editingSiswa.nis);
        setNamaSiswa(editingSiswa.namaSiswa);
        setKelas(editingSiswa.kelas);
        setTotalPoin(editingSiswa.totalPoin);
      } else {
        setNis('');
        setNamaSiswa('');
        setKelas('X-1');
        setTotalPoin(0);
      }
    }
  }, [isOpen, editingSiswa]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nis.trim() || !namaSiswa.trim()) return;

    onSaveSiswa(
      {
        nis: nis.trim(),
        namaSiswa: namaSiswa.trim(),
        kelas: kelas.trim(),
        totalPoin: Number(totalPoin) || 0,
      },
      'SAVE'
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden">
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-blue-400" />
            <h4 className="font-bold text-sm">
              {editingSiswa ? 'Edit Data Siswa' : 'Tambah Siswa Baru (Sheet Siswa)'}
            </h4>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div>
            <label className="block text-xs font-semibold mb-1">NIS (Nomor Induk Siswa)</label>
            <input
              type="text"
              value={nis}
              onChange={(e) => setNis(e.target.value)}
              placeholder="Contoh: 20231011"
              className="w-full p-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700"
              required
              disabled={!!editingSiswa}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Nama Lengkap Siswa</label>
            <input
              type="text"
              value={namaSiswa}
              onChange={(e) => setNamaSiswa(e.target.value)}
              placeholder="Contoh: Muhammad Rizky"
              className="w-full p-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Kelas</label>
            <input
              type="text"
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              placeholder="Contoh: X-1, XI-IPA-2, XII-IPS-1"
              className="w-full p-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Total Poin Awal</label>
            <input
              type="number"
              min={0}
              value={totalPoin}
              onChange={(e) => setTotalPoin(Number(e.target.value))}
              className="w-full p-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700"
              required
            />
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Siswa</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
