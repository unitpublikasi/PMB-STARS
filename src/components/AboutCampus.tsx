import React from 'react';
import { Building2, Compass, Award, BookOpen, Clock, MapPin, Phone, Mail, Globe, CheckCircle, FileCheck, CreditCard } from 'lucide-react';
import { 
  BIAYA_KELAS_REGULER, 
  PERSYARATAN_KELAS_REGULER, 
  BIAYA_KELAS_KARYAWAN, 
  PERSYARATAN_KELAS_KARYAWAN 
} from '../data/initialData';

interface AboutCampusProps {
  onBackToForm: () => void;
}

export const AboutCampus: React.FC<AboutCampusProps> = ({ onBackToForm }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="w-24 h-24 mx-auto p-2 rounded-2xl bg-white shadow-md border border-slate-200 ring-4 ring-amber-400/20 flex items-center justify-center">
          <img
            src="/assets/aistudio/image_84723e49.png"
            alt="Logo STARS YKPN Yogyakarta"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4 text-blue-700" />
          <span>Profil Kampus Khusus Arsitektur</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Sekolah Tinggi Arsitektur YKPN Yogyakarta
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-base">
          Kampus pelopor pendidikan arsitektur di Yogyakarta yang berdedikasi melahirkan arsitek berwawasan tropis, berdaya saing global, inovatif, dan beretika profesi tinggi.
        </p>
      </div>

      {/* Program Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Program Sarjana (S1) Arsitektur - Reguler</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Dirancang khusus bagi lulusan SMA/SMK/MA yang ingin fokus mendalami ilmu arsitektur secara penuh waktu. Pembelajaran berbasis studio interaktif dengan bimbingan dosen arsitek praktisi berlisensi IAI.
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Studio Perancangan Arsitektur 1 s.d. 8 komprehensif</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Kurikulum adaptif terhadap teknologi BIM & Arsitektur Berkelanjutan</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Kuliah Kerja Lapangan (KKL) studi arsitektur nusantara & internasional</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Program Sarjana (S1) Arsitektur - Kelas Karyawan</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Pilihan ideal bagi para drafter, pengawas proyek, kontraktor, karyawan swasta, ASN, maupun entrepreneur yang ingin meningkatkan jenjang karir dan kualifikasi ke Sarjana Arsitektur dengan waktu fleksibel.
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Jadwal kuliah sore, malam, dan hybrid (daring & luring)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Rekognisi Pembelajaran Lampau (RPL) untuk lulusan D3/vokasi</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Jaringan networking sesama profesional industri rancang bangun</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Rincian Biaya & Persyaratan Kelas Reguler */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-blue-200/90 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Informasi Resmi PMB • T.A. 2027 / 2028</span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
              Biaya Pendidikan & Persyaratan Kelas Reguler
            </h3>
          </div>
          <span className="self-start sm:self-auto text-xs bg-blue-100 text-blue-900 font-bold px-3 py-1 rounded-full border border-blue-200">
            Jalur Reguler • T.A. 2027/2028
          </span>
        </div>

        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-3">
            Rincian Biaya (SPA & SPP) Per Gelombang:
          </h4>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 uppercase text-[11px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Gelombang & Periode</th>
                  <th className="py-3 px-4 text-right">SPA</th>
                  <th className="py-3 px-4 text-right">SPP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {BIAYA_KELAS_REGULER.map((item, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <span className="font-extrabold text-blue-900 mr-2">{item.nama}</span>
                      <span className="text-slate-500 text-xs font-normal">({item.periode})</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {item.spa}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-blue-800">
                      {item.spp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            * <strong>SPA</strong>: Sumbangan Pengembangan Akademik (dibayar di awal) | <strong>SPP</strong>: Sumbangan Pembinaan Pendidikan per semester.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-3">
            Persyaratan Berkas Pendaftaran (Kelas Reguler - 8 Dokumen):
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            {PERSYARATAN_KELAS_REGULER.map((syarat, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-medium">{syarat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rincian Biaya & Persyaratan Kelas Karyawan */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/90 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Informasi Resmi PMB • T.A. 2027 / 2028</span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
              Biaya Pendidikan & Persyaratan Kelas Karyawan
            </h3>
          </div>
          <span className="self-start sm:self-auto text-xs bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full border border-amber-200">
            Jalur Karyawan • T.A. 2027/2028
          </span>
        </div>

        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-3">
            Rincian Biaya Kuliah:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
              <span className="text-xs text-amber-900 font-semibold uppercase tracking-wider">SPA (Sumbangan Pengembangan Akademik)</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{BIAYA_KELAS_KARYAWAN.spa}</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
              <span className="text-xs text-amber-900 font-semibold uppercase tracking-wider">SPP (Sumbangan Pembinaan Pendidikan)</span>
              <p className="text-2xl font-extrabold text-amber-800 mt-1 font-mono">{BIAYA_KELAS_KARYAWAN.spp}</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              Persyaratan Berkas Dokumen (11 Item Lengkap):
            </h4>
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
              Wajib menyertakan CV, Portofolio & Surat Kerja
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {PERSYARATAN_KELAS_KARYAWAN.map((syarat, idx) => {
              const isExtra = idx >= 8;
              return (
                <div key={idx} className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs ${
                  isExtra ? 'bg-amber-50 border-amber-300 font-bold text-amber-950' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <CheckCircle className={`w-4 h-4 shrink-0 ${isExtra ? 'text-amber-600' : 'text-emerald-600'}`} />
                  <span className="font-medium">{syarat}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Facilities & Address */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Kampus & Studio</span>
            <h2 className="text-2xl font-extrabold mt-1">Sekolah Tinggi Arsitektur YKPN (STARS YKPN)</h2>
          </div>
          <button
            type="button"
            onClick={onBackToForm}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20"
          >
            Daftar Sekarang (Isi Formulir)
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-300">
          <div className="flex gap-3 items-start">
            <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white text-sm">Alamat Kampus</p>
              <p className="mt-1 text-slate-400">
                Jl. Gagak Rimang No. 2-4, Balapan, Klitren, Gondokusuman, Kota Yogyakarta, D.I. Yogyakarta 55222
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white text-sm">Kontak & WhatsApp PMB</p>
              <p className="mt-1 text-slate-400">Hotline: (0274) 560000</p>
              <p className="text-slate-400">WhatsApp PMB: 0812-3456-7890</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <Globe className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white text-sm">Website & Email Resmi</p>
              <p className="mt-1 text-slate-400">pmb@starsykpn.ac.id</p>
              <p className="text-slate-400">www.starsykpn.ac.id</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
