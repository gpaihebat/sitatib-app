import { User, Siswa, KategoriPelanggaran, LogData } from '../types';
import { INITIAL_USERS, INITIAL_SISWA, INITIAL_KATEGORI, INITIAL_LOG } from '../data/initialData';

const GAS_URL = "https://script.google.com/macros/s/AKfycbwuu30IZ8M9khLf0azfFhr_6AsAwQyJtM_LJdoxBuDH-aeT8XfPbaEMV73ASNJoNuaY/exec";

// In-memory fallback if GAS_URL is not set (for local dev/preview)
let mockSiswaList = [...INITIAL_SISWA];
let mockLogList = [...INITIAL_LOG];

export const isUsingMock = !GAS_URL || GAS_URL.trim() === "";

export const apiFetch = async (action: string, payload: any = {}): Promise<any> => {
  if (isUsingMock) {
    console.warn(`[Mock API] action: ${action}`);
    return handleMockApi(action, payload);
  }

  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      body: JSON.stringify({ action, payload }),
      // headers are omitted to trigger a simple request (avoid CORS preflight issues in GAS)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
};

const handleMockApi = async (action: string, payload: any) => {
  await new Promise(r => setTimeout(r, 400)); // simulate network latency
  
  if (action === "login") {
    const u = INITIAL_USERS.find(user => user.username === payload.username && user.password === payload.password);
    if (u) return { success: true, user: u };
    return { success: false, message: "Username atau password salah!" };
  }
  
  if (action === "getInitialData") {
    return {
      success: true,
      siswa: mockSiswaList,
      kategori: INITIAL_KATEGORI,
      logs: mockLogList
    };
  }
  
  if (action === "tambahPelanggaran") {
    const index = mockSiswaList.findIndex(s => s.nis === payload.nis);
    if (index > -1) {
      mockSiswaList[index].totalPoin += payload.poin;
      mockLogList.unshift({
        id: `LOG${Date.now()}`,
        timestamp: new Date().toISOString(),
        nis: payload.nis,
        namaSiswa: payload.namaSiswa,
        jenisPelanggaran: payload.jenisPelanggaran,
        poinDitambahkanDikurangi: payload.poin,
        keterangan: payload.keterangan,
        namaPetugas: payload.namaPetugas,
        rolePetugas: payload.rolePetugas
      });
      return { success: true, message: `Pelanggaran berhasil dicatat! Total poin: ${mockSiswaList[index].totalPoin}` };
    }
    return { success: false, message: "Siswa tidak ditemukan." };
  }
  
  if (action === "kurangiPelanggaran") {
    const index = mockSiswaList.findIndex(s => s.nis === payload.nis);
    if (index > -1) {
      mockSiswaList[index].totalPoin = Math.max(0, mockSiswaList[index].totalPoin - payload.poin);
      mockLogList.unshift({
        id: `LOG${Date.now()}`,
        timestamp: new Date().toISOString(),
        nis: payload.nis,
        namaSiswa: payload.namaSiswa,
        jenisPelanggaran: "Pengurangan Poin",
        poinDitambahkanDikurangi: -payload.poin,
        keterangan: payload.keterangan,
        namaPetugas: payload.namaPetugas,
        rolePetugas: payload.rolePetugas
      });
      return { success: true, message: `Poin berhasil dikurangi! Total poin: ${mockSiswaList[index].totalPoin}` };
    }
    return { success: false, message: "Siswa tidak ditemukan." };
  }

  if (action === "tambahSiswa") {
    const exists = mockSiswaList.find(s => s.nis === payload.nis);
    if (exists) return { success: false, message: "Siswa dengan NIS tersebut sudah ada." };
    
    mockSiswaList.push({
      nis: payload.nis,
      namaSiswa: payload.namaSiswa,
      kelas: payload.kelas,
      totalPoin: 0,
      waliKelas: payload.waliKelas
    });
    return { success: true, message: "Siswa berhasil ditambahkan!" };
  }

  return { success: false, message: "Mock action not supported" };
};
