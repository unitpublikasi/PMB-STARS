import { Registration } from '../types';

export const INITIAL_REGISTRATIONS: Registration[] = [
  {
    id: 'REG-YKPN-2026-001',
    program: 'reguler',
    namaLengkap: 'Bagus Pratama Wicaksono',
    alamat: 'Jl. Kaliurang KM 8.5, Ngaglik, Sleman, D.I. Yogyakarta',
    asalSekolahOrPerusahaan: 'SMAN 1 Yogyakarta',
    noWaAktif: '081234567890',
    noWaOrtu: '081398765432',
    email: 'bagus.pratama@gmail.com',
    alasanMendaftar: 'Tertarik dengan kurikulum studio arsitektur STARS YKPN yang berfokus pada desain arsitektur tropis dan ekologis berkelanjutan.',
    infoDapatDari: 'Instagram Resmi STARS YKPN',
    status: 'diverifikasi',
    createdAt: '2026-10-25T09:15:00.000Z',
    catatanAdmin: 'Berkas rapikan, calon mahasiswa berprestasi olimpiade desain.'
  },
  {
    id: 'REG-YKPN-2026-002',
    program: 'karyawan',
    namaLengkap: 'Dian Anindya Putri, A.Md.',
    alamat: 'Jl. Gejayan No. 45, Condongcatur, Depok, Sleman',
    asalSekolahOrPerusahaan: 'PT. Cipta Graha Studio Arsitektur (Drafter)',
    noWaAktif: '085729123456',
    noWaOrtu: '081223344556',
    email: 'dian.anindya.arch@outlook.com',
    alasanMendaftar: 'Ingin meningkatkan jenjang pendidikan ke Sarjana Arsitektur untuk meraih lisensi arsitek profesional (STRA) tanpa mengganggu jam kerja kantor.',
    infoDapatDari: 'Teman / Rekan Kerja',
    gelombang: 'Gel. 1 (01 Des 2026 - 30 April 2027)',
    status: 'baru',
    createdAt: '2026-10-26T14:30:00.000Z'
  },
  {
    id: 'REG-YKPN-2026-003',
    program: 'reguler',
    namaLengkap: 'Farhan Rizki Ramadhan',
    alamat: 'Jl. Brigjen Katamso No. 120, Keparakan, Mergangsan, Kota Yogyakarta',
    asalSekolahOrPerusahaan: 'SMKN 2 Depok Sleman (Teknik Gambar Bangunan)',
    noWaAktif: '087812998877',
    noWaOrtu: '082133445566',
    email: 'farhan.ramadhan03@gmail.com',
    alasanMendaftar: 'Melanjutkan keahlian vokasi teknik gambar bangunan ke tingkat sarjana arsitektur di kampus khusus arsitektur terbaik di Jogja.',
    infoDapatDari: 'Guru / Bimbingan Konseling Sekolah',
    status: 'dihubungi',
    createdAt: '2026-10-27T10:05:00.000Z',
    catatanAdmin: 'Sudah dihubungi via WA, diundang open house studio.'
  },
  {
    id: 'REG-YKPN-2026-004',
    program: 'karyawan',
    namaLengkap: 'Hendro Gunawan',
    alamat: 'Jl. Magelang KM 5, Mlati, Sleman',
    asalSekolahOrPerusahaan: 'CV. Karya Nusantara Mandiri (Kontraktor)',
    noWaAktif: '081987654321',
    noWaOrtu: '081876543210',
    email: 'hendro.gunawan.contractor@gmail.com',
    alasanMendaftar: 'Membutuhkan kompetensi rancang bangun yang komprehensif untuk mengembangkan usaha jasa konstruksi dan perizinan PBG.',
    infoDapatDari: 'Website Resmi STARS YKPN',
    gelombang: 'Gel. 2 (01 Mei 2027 - 30 Juli 2027)',
    status: 'diterima',
    createdAt: '2026-10-28T16:20:00.000Z',
    catatanAdmin: 'Pembayaran tahap 1 telah dikonfirmasi.'
  },
  {
    id: 'REG-YKPN-2026-005',
    program: 'reguler',
    namaLengkap: 'Siti Nurhaliza Azzahra',
    alamat: 'Jl. Wonosari KM 4, Banguntapan, Bantul',
    asalSekolahOrPerusahaan: 'SMA Muhammadiyah 1 Yogyakarta',
    noWaAktif: '082211447788',
    noWaOrtu: '081299887766',
    email: 'siti.azzahra2026@gmail.com',
    alasanMendaftar: 'Memiliki passion menggambar sketsa dan bercita-cita menjadi arsitek perumahan ramah lingkungan bersama STARS YKPN.',
    infoDapatDari: 'Pameran Pendidikan / Edufair Jogja Expo Center',
    status: 'baru',
    createdAt: '2026-10-29T11:45:00.000Z'
  }
];

export const INFO_SOURCES = [
  'Instagram Resmi STARS YKPN',
  'TikTok / Media Sosial',
  'Website Resmi STARS YKPN',
  'Guru / Bimbingan Konseling Sekolah',
  'Teman / Rekan Kerja / Keluarga',
  'Alumni STARS YKPN',
  'Pameran Pendidikan / Edufair Jogja Expo Center',
  'Brosur / Spanduk Kampus',
  'Pencarian Google',
  'Lainnya'
];

export interface GelombangBiaya {
  nama: string;
  periode: string;
  spa: string;
  spp: string;
}

// Biaya & Gelombang Kelas Reguler
export const BIAYA_KELAS_REGULER: GelombangBiaya[] = [
  {
    nama: 'Gel. 1',
    periode: '01 Des 2026 - 30 April 2027',
    spa: 'Rp. 4.000.000,-',
    spp: 'Rp. 6.000.000,-',
  },
  {
    nama: 'Gel. 2',
    periode: '01 Mei 2027 - 30 Juli 2027',
    spa: 'Rp. 5.000.000,-',
    spp: 'Rp. 6.000.000,-',
  },
  {
    nama: 'Gel. 3',
    periode: '01 Agt. 2027 - 30 Sept. 2027',
    spa: 'Rp. 6.000.000,-',
    spp: 'Rp. 6.000.000,-',
  },
];

export const PERSYARATAN_KELAS_REGULER: string[] = [
  'Ijazah SMA/Sederajat',
  'Akte Kelahiran',
  'Kartu Keluarga',
  'Surat Keterangan Sehat',
  'Surat Keterangan Tidak Buta Warna',
  'Surat Bebas NAPSA',
  'Surat Berkelakuan Baik',
  'Pas Foto Berwarna',
];

// Biaya & Persyaratan Kelas Karyawan
export const BIAYA_KELAS_KARYAWAN = {
  spa: 'Rp. 7.000.000,-',
  spp: 'Rp. 7.000.000,-',
};

export const PERSYARATAN_KELAS_KARYAWAN: string[] = [
  'Ijazah SMA/Sederajat',
  'Akte Kelahiran',
  'Kartu Keluarga',
  'Surat Keterangan Sehat',
  'Surat Keterangan Tidak Buta Warna',
  'Surat Bebas NAPSA',
  'Surat Berkelakuan Baik',
  'Pas Foto Berwarna',
  'Curiculum Vitae (CV)',
  'Portofolio',
  'Surat Keterangan Kerja',
];


