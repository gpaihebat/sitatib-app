export type Role = 'GURU' | 'TIM TATIB' | 'ADMIN';

export interface User {
  id: string;
  username: string;
  password?: string;
  nama: string;
  role: Role;
  jabatan?: string;
  nip?: string;
}

export interface Siswa {
  nis: string;
  namaSiswa: string;
  kelas: string;
  totalPoin: number;
  waliKelas?: string;
}

export interface KategoriPelanggaran {
  idPelanggaran: string;
  namaPelanggaran: string;
  bobotPoin: number;
  keterangan?: string; // Tindakan / Sanksi dari pelanggaran
}

export interface LogData {
  id?: string;
  timestamp: string;
  nis: string;
  namaSiswa: string;
  jenisPelanggaran: string;
  poinDitambahkanDikurangi: number; // positive for addition, negative for reduction
  keterangan: string;
  namaPetugas: string;
  rolePetugas: Role;
}

export interface GasFile {
  filename: string;
  language: string;
  description: string;
  code: string;
}
