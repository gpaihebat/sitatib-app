import { User, Siswa, KategoriPelanggaran, LogData } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'USR001',
    username: 'admin',
    password: 'admin123',
    nama: 'Ahmad Muzakki, S.Pd.',
    role: 'ADMIN',
    jabatan: 'Koordinator Tatib',
    nip: '19800101 200501 1 001'
  },
  {
    id: 'USR002',
    username: 'tatib1',
    password: 'tatib123',
    nama: 'Dra. Budi Mulyani',
    role: 'TIM TATIB',
    jabatan: 'Tim Tatib Kelas X',
    nip: '19780512 200501 2 004'
  },
  {
    id: 'USR003',
    username: 'guru1',
    password: 'guru123',
    nama: 'Siti Rahmawati, M.Pd.',
    role: 'GURU',
    jabatan: 'Guru Piket',
    nip: '19850315 201001 2 003'
  },
];

export const INITIAL_SISWA: Siswa[] = [
  { nis: '20231001', namaSiswa: 'Aditya Pratama', kelas: 'X-1', totalPoin: 15, waliKelas: 'Dra. Hj. Nur Aini, M.Pd.' },
  { nis: '20231002', namaSiswa: 'Bagus Setyawan', kelas: 'X-2', totalPoin: 35, waliKelas: 'Drs. Bambang Hidayat, M.M.' },
  { nis: '20231003', namaSiswa: 'Citra Dewi Permata', kelas: 'XI-IPA-1', totalPoin: 0, waliKelas: 'Siti Aminah, S.Pd.' },
  { nis: '20231004', namaSiswa: 'Dian Anggraini', kelas: 'XI-IPA-2', totalPoin: 5, waliKelas: 'Agus Susanto, S.Pd.' },
  { nis: '20231005', namaSiswa: 'Eko Prasetyo', kelas: 'XI-IPS-1', totalPoin: 65, waliKelas: 'Rina Indriani, S.Pd.' },
  { nis: '20231006', namaSiswa: 'Fajar Kurniawan', kelas: 'XII-IPA-1', totalPoin: 110, waliKelas: 'Drs. H. M. Supriyadi' },
  { nis: '20231007', namaSiswa: 'Gita Gutawa', kelas: 'XII-IPS-2', totalPoin: 20, waliKelas: 'Endang Lestari, S.Pd.' },
  { nis: '20231008', namaSiswa: 'Hadi Wijaya', kelas: 'X-3', totalPoin: 0, waliKelas: 'Dewi Kartika, S.Pd.' },
  { nis: '20231009', namaSiswa: 'Intan Nuraini', kelas: 'XI-IPA-3', totalPoin: 10, waliKelas: 'M. Ali Ridho, S.Si.' },
  { nis: '20231010', namaSiswa: 'Joko Susilo', kelas: 'XII-IPS-1', totalPoin: 45, waliKelas: 'Tri Wahyuni, S.Pd.' },
];

export const INITIAL_KATEGORI: KategoriPelanggaran[] = [
  { idPelanggaran: 'PLG001', namaPelanggaran: 'Terlambat Masuk Sekolah (< 15 menit)', bobotPoin: 5, keterangan: 'Pembinaan Lisan & Pencatatan Guru Piket' },
  { idPelanggaran: 'PLG002', namaPelanggaran: 'Terlambat Masuk Sekolah (> 15 menit)', bobotPoin: 10, keterangan: 'Pembinaan Wali Kelas & Peringatan Tertulis' },
  { idPelanggaran: 'PLG003', namaPelanggaran: 'Tidak Memakai Seragam Sesuai Ketentuan', bobotPoin: 5, keterangan: 'Teguran & Penertiban Atribut di Tempat' },
  { idPelanggaran: 'PLG004', namaPelanggaran: 'Rambut Tidak Rapi / Panjang Bagi Siswa Putra', bobotPoin: 5, keterangan: 'Pembinaan & Pemotongan Rambut Mandiri' },
  { idPelanggaran: 'PLG005', namaPelanggaran: 'Bolos Jam Pelajaran / Keluar Tanpa Izin', bobotPoin: 15, keterangan: 'Peringatan Tertulis & Tugas Edukatif Tambahan' },
  { idPelanggaran: 'PLG006', namaPelanggaran: 'Membawa / Memainkan HP Saat Jam Pelajaran Tanpa Izin', bobotPoin: 10, keterangan: 'Penyitaan HP Sementara & Pembinaan Guru BK' },
  { idPelanggaran: 'PLG007', namaPelanggaran: 'Merekam / Mengunggah Konten Tidak Etis Berpakaian Seragam', bobotPoin: 25, keterangan: 'Skorsing 3 Hari & Pemanggilan Orang Tua / Wali' },
  { idPelanggaran: 'PLG008', namaPelanggaran: 'Merokok di Lingkungan Sekolah', bobotPoin: 50, keterangan: 'Skorsing 3-7 Hari & Pemanggilan Orang Tua ke Sekolah' },
  { idPelanggaran: 'PLG009', namaPelanggaran: 'Tawuran / Batalion / Perkelahian', bobotPoin: 100, keterangan: 'Skorsing 1 Minggu & Surat Peringatan Keras (SP 3)' },
  { idPelanggaran: 'PLG010', namaPelanggaran: 'Tindakan Perundungan / Bullying', bobotPoin: 50, keterangan: 'Pembinaan Khusus Tim Tatib/BK & Panggilan Orang Tua' },
];

export const INITIAL_LOG: LogData[] = [
  {
    id: 'LOG101',
    timestamp: '2026-07-25 07:15:22',
    nis: '20231006',
    namaSiswa: 'Fajar Kurniawan',
    jenisPelanggaran: 'Merokok di Lingkungan Sekolah',
    poinDitambahkanDikurangi: 50,
    keterangan: 'Ketahuan di belakang kantin saat jam istirahat pertama',
    namaPetugas: 'Dra. Budi Mulyani (Tim Tatib)',
    rolePetugas: 'TIM TATIB',
  },
  {
    id: 'LOG102',
    timestamp: '2026-07-24 07:05:10',
    nis: '20231005',
    namaSiswa: 'Eko Prasetyo',
    jenisPelanggaran: 'Bolos Jam Pelajaran / Keluar Tanpa Izin',
    poinDitambahkanDikurangi: 15,
    keterangan: 'Lompat pagar belakang sekolah jam ke-4',
    namaPetugas: 'Siti Rahmawati, M.Pd. (Guru Piket)',
    rolePetugas: 'GURU',
  },
  {
    id: 'LOG103',
    timestamp: '2026-07-23 08:30:00',
    nis: '20231002',
    namaSiswa: 'Bagus Setyawan',
    jenisPelanggaran: 'Pengurangan Poin (Reward / Tugas Kebersihan)',
    poinDitambahkanDikurangi: -10,
    keterangan: 'Poin dikurangi karena telah menyelesaikan sanksi kebersihan lingkungan perpustakaan',
    namaPetugas: 'Dra. Budi Mulyani (Tim Tatib)',
    rolePetugas: 'TIM TATIB',
  },
];
