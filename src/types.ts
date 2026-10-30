export type ProgramType = 'reguler' | 'karyawan';

export type RegistrationStatus = 'baru' | 'diverifikasi' | 'dihubungi' | 'diterima';

export interface Registration {
  id: string; // e.g. REG-YKPN-2026-001
  program: ProgramType;
  namaLengkap: string;
  alamat: string;
  asalSekolahOrPerusahaan: string; // "Asal Sekolah" for regular, "Asal Sekolah / Perusahaan" for karyawan
  noWaAktif: string;
  noWaOrtu: string;
  email: string;
  alasanMendaftar: string;
  infoDapatDari: string;
  infoDapatDariDetail?: string;
  gelombang?: string;
  status: RegistrationStatus;
  createdAt: string; // ISO date string
  catatanAdmin?: string;
}

export interface RegistrationFormData {
  program: ProgramType;
  namaLengkap: string;
  alamat: string;
  asalSekolahOrPerusahaan: string;
  noWaAktif: string;
  noWaOrtu: string;
  email: string;
  alasanMendaftar: string;
  infoDapatDari: string;
  infoDapatDariDetail?: string;
  gelombang?: string;
}

export interface AdminUser {
  username: string;
  role: string;
  loggedInAt: string;
}
