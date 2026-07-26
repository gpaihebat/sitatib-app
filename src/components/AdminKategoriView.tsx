import React, { useState } from 'react';
import { KategoriPelanggaran } from '../types';
import { ListPlus, Edit, Trash2, ListChecks, X } from 'lucide-react';

interface AdminKategoriViewProps {
  kategoriList: KategoriPelanggaran[];
  onSaveKategori: (
    kategori: KategoriPelanggaran,
    action: 'SAVE' | 'DELETE'
  ) => void;
}

export const AdminKategoriView: React.FC<AdminKategoriViewProps> = ({
  kategoriList,
  onSaveKategori,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KategoriPelanggaran | null>(null);

  const [namaPelanggaran, setNamaPelanggaran] = useState('');
  const [bobotPoin, setBobotPoin] = useState<number>(10);
  const [keterangan, setKeterangan] = useState('');

  const openAdd = () => {
    setEditingItem(null);
    setNamaPelanggaran('');
    setBobotPoin(10);
    setKeterangan('');
    setIsModalOpen(true);
  };

  const openEdit = (k: KategoriPelanggaran) => {
    setEditingItem(k);
    setNamaPelanggaran(k.namaPelanggaran);
    setBobotPoin(k.bobotPoin);
    setKeterangan(k.keterangan || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: KategoriPelanggaran = {
      idPelanggaran: editingItem
        ? editingItem.idPelanggaran
        : 'PLG' + Math.floor(100 + Math.random() * 900),
      namaPelanggaran: namaPelanggaran.trim(),
      bobotPoin: Number(bobotPoin),
      keterangan: keterangan.trim() || 'Tindakan Sesuai Prosedur Tatib',
    };

    onSaveKategori(item, 'SAVE');
    setIsModalOpen(false);
  };

  const handleDelete = (k: KategoriPelanggaran) => {
    if (confirm(`Hapus kategori pelanggaran "${k.namaPelanggaran}"?`)) {
      onSaveKategori(k, 'DELETE');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-indigo-600" />
            <span>Master Kategori Pelanggaran (Sheet "KategoriPelanggaran")</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Daftar Jenis Pelanggaran Tata Tertib beserta Bobot Poinnya
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          <ListPlus className="w-3.5 h-3.5" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Nama Jenis Pelanggaran</th>
              <th className="py-3 px-4 text-center">Bobot Poin</th>
              <th className="py-3 px-4">Tindakan / Sanksi / Keterangan</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {kategoriList.map((k) => (
              <tr key={k.idPelanggaran} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                <td className="py-3 px-4 font-mono font-medium">{k.idPelanggaran}</td>
                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                  {k.namaPelanggaran}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
                    {k.bobotPoin} Poin
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                  {k.keterangan || '-'}
                </td>
                <td className="py-3 px-4 text-right space-x-1">
                  <button
                    onClick={() => openEdit(k)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(k)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <h4 className="font-bold text-sm">
                {editingItem ? 'Edit Kategori Pelanggaran' : 'Tambah Kategori Pelanggaran'}
              </h4>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400 hover:text-white" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Nama Pelanggaran</label>
                <input
                  type="text"
                  value={namaPelanggaran}
                  onChange={(e) => setNamaPelanggaran(e.target.value)}
                  className="w-full p-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Bobot Poin Pelanggaran</label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={bobotPoin}
                  onChange={(e) => setBobotPoin(Number(e.target.value))}
                  className="w-full p-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Tindakan / Sanksi dari Pelanggaran (Keterangan)</label>
                <textarea
                  rows={2}
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Contoh: Pembinaan Wali Kelas & Panggilan Ortu"
                  className="w-full p-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-xl"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
