import React, { useState } from 'react';
import { 
  Building2, 
  Send, 
  RotateCcw, 
  CheckCircle2, 
  FileDown, 
  MessageSquare, 
  GraduationCap, 
  Briefcase, 
  MapPin, 
  Phone, 
  Mail, 
  HelpCircle, 
  School,
  ArrowRight,
  ShieldCheck,
  Check,
  CreditCard,
  CalendarClock,
  FileCheck
} from 'lucide-react';
import { ProgramType, RegistrationFormData, Registration } from '../types';
import { 
  INFO_SOURCES, 
  BIAYA_KELAS_REGULER, 
  PERSYARATAN_KELAS_REGULER, 
  BIAYA_KELAS_KARYAWAN, 
  PERSYARATAN_KELAS_KARYAWAN 
} from '../data/initialData';
import { exportSingleRegistrationPdf } from '../utils/exportUtils';
import { createRegistrationCloud } from '../utils/firestoreService';

interface PublicFormProps {
  onSubmitSuccess: (newRegistration: Registration) => void;
}

export const PublicForm: React.FC<PublicFormProps> = ({ onSubmitSuccess }) => {
  const [program, setProgram] = useState<ProgramType>('reguler');
  
  const [formData, setFormData] = useState<RegistrationFormData>({
    program: 'reguler',
    namaLengkap: '',
    alamat: '',
    asalSekolahOrPerusahaan: '',
    noWaAktif: '',
    noWaOrtu: '',
    email: '',
    alasanMendaftar: '',
    infoDapatDari: INFO_SOURCES[0],
    infoDapatDariDetail: '',
    gelombang: 'Gel. 1 (01 Des 2026 - 30 April 2027)',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRegistration, setSubmittedRegistration] = useState<Registration | null>(null);

  // Switch program tab
  const handleProgramChange = (newProgram: ProgramType) => {
    setProgram(newProgram);
    setFormData(prev => ({
      ...prev,
      program: newProgram,
      gelombang: newProgram === 'karyawan' ? (prev.gelombang || 'Gel. 1 (01 Des 2026 - 30 April 2027)') : undefined,
    }));
  };

  const handleInputChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.namaLengkap.trim()) {
      newErrors.namaLengkap = 'Nama lengkap wajib diisi';
    } else if (formData.namaLengkap.trim().length < 3) {
      newErrors.namaLengkap = 'Nama minimal 3 karakter';
    }

    if (!formData.alamat.trim()) {
      newErrors.alamat = 'Alamat tempat tinggal / domisili wajib diisi';
    }

    if (!formData.asalSekolahOrPerusahaan.trim()) {
      newErrors.asalSekolahOrPerusahaan = program === 'reguler' 
        ? 'Asal sekolah (SMA/SMK/MA) wajib diisi' 
        : 'Asal sekolah atau instansi/perusahaan tempat kerja wajib diisi';
    }

    // Phone validations
    const phoneRegex = /^[0-9+() -]{9,16}$/;
    if (!formData.noWaAktif.trim()) {
      newErrors.noWaAktif = 'No. WhatsApp aktif calon mahasiswa wajib diisi';
    } else if (!phoneRegex.test(formData.noWaAktif.trim())) {
      newErrors.noWaAktif = 'Format nomor WhatsApp tidak valid (contoh: 081234567890)';
    }

    if (!formData.noWaOrtu.trim()) {
      newErrors.noWaOrtu = 'No. WhatsApp orangtua / wali wajib diisi';
    } else if (!phoneRegex.test(formData.noWaOrtu.trim())) {
      newErrors.noWaOrtu = 'Format nomor WhatsApp tidak valid (contoh: 081234567890)';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Alamat email aktif wajib diisi';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Format email tidak valid (contoh: nama@gmail.com)';
    }

    if (!formData.alasanMendaftar.trim()) {
      newErrors.alasanMendaftar = 'Alasan mendaftar di STARS YKPN wajib diisi';
    } else if (formData.alasanMendaftar.trim().length < 15) {
      newErrors.alasanMendaftar = 'Mohon uraikan alasan Anda lebih jelas (minimal 15 karakter)';
    }

    if (formData.infoDapatDari === 'Lainnya' && !formData.infoDapatDariDetail?.trim()) {
      newErrors.infoDapatDariDetail = 'Sebutkan sumber info lainnya';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // Scroll to first error
      window.scrollTo({ top: 380, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    
    createRegistrationCloud(formData)
      .then((saved) => {
        setIsSubmitting(false);
        setSubmittedRegistration(saved);
        onSubmitSuccess(saved);
      })
      .catch((err) => {
        console.error('Error submitting to Cloud Firestore:', err);
        import('../utils/storage').then(({ addRegistration }) => {
          const fallbackSaved = addRegistration(formData);
          setIsSubmitting(false);
          setSubmittedRegistration(fallbackSaved);
          onSubmitSuccess(fallbackSaved);
        });
      });
  };

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mengosongkan seluruh formulir?')) {
      setFormData({
        program,
        namaLengkap: '',
        alamat: '',
        asalSekolahOrPerusahaan: '',
        noWaAktif: '',
        noWaOrtu: '',
        email: '',
        alasanMendaftar: '',
        infoDapatDari: INFO_SOURCES[0],
        infoDapatDariDetail: '',
      });
      setErrors({});
    }
  };

  const handleNewRegistration = () => {
    setSubmittedRegistration(null);
    setFormData({
      program: 'reguler',
      namaLengkap: '',
      alamat: '',
      asalSekolahOrPerusahaan: '',
      noWaAktif: '',
      noWaOrtu: '',
      email: '',
      alasanMendaftar: '',
      infoDapatDari: INFO_SOURCES[0],
      infoDapatDariDetail: '',
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 p-2 rounded-2xl bg-white shadow-md border border-slate-200/80 ring-4 ring-amber-400/20 flex items-center justify-center">
          <img
            src="/assets/aistudio/image_84723e49.png"
            alt="Logo Resmi Sekolah Tinggi Arsitektur YKPN Yogyakarta"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/20 text-xs sm:text-sm font-semibold mb-3">
          <Building2 className="w-4 h-4 text-amber-600" />
          <span>Tahun Akademik 2027 / 2028 • Gelombang Terbuka</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Penerimaan Mahasiswa/i Baru
        </h1>
        <p className="mt-3 text-lg sm:text-xl text-slate-600 font-medium">
          Sekolah Tinggi Arsitektur YKPN Yogyakarta (STARS YKPN)
        </p>
        <p className="mt-2 text-sm text-slate-500 max-w-2xl mx-auto">
          Silakan lengkapi formulir pendaftaran resmi di bawah ini dengan data yang benar dan dapat dipertanggungjawabkan.
        </p>
      </div>

      {/* Program Selection Segmented Buttons */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="bg-slate-200/80 p-1.5 rounded-2xl flex flex-col sm:flex-row gap-2 shadow-inner">
          <button
            type="button"
            onClick={() => handleProgramChange('reguler')}
            className={`flex-1 flex items-center justify-center gap-3 py-3.5 px-5 rounded-xl transition-all text-left ${
              program === 'reguler'
                ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 font-medium'
            }`}
          >
            <div className={`p-2 rounded-lg ${program === 'reguler' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base">1. Kelas Reguler</span>
                {program === 'reguler' && (
                  <span className="text-[10px] bg-blue-600 text-white font-semibold px-2 py-0.5 rounded-full">
                    Aktif
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Lulusan SMA / SMK / MA (Kuliah Reguler Pagi & Siang)
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleProgramChange('karyawan')}
            className={`flex-1 flex items-center justify-center gap-3 py-3.5 px-5 rounded-xl transition-all text-left ${
              program === 'karyawan'
                ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 font-medium'
            }`}
          >
            <div className={`p-2 rounded-lg ${program === 'karyawan' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base">2. Kelas Karyawan</span>
                {program === 'karyawan' && (
                  <span className="text-[10px] bg-amber-600 text-white font-semibold px-2 py-0.5 rounded-full">
                    Aktif
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Karyawan / Profesional / Wirausaha (Jadwal Fleksibel)
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Informasi Biaya & Persyaratan Kelas Reguler */}
      {program === 'reguler' && (
        <div className="max-w-3xl mx-auto mb-8 bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-blue-200/90 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white px-6 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/15 text-blue-200">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  Biaya Pendidikan & Persyaratan Kelas Reguler
                </h3>
                <p className="text-xs text-blue-200">
                  Sekolah Tinggi Arsitektur YKPN (STARS YKPN) Yogyakarta • T.A. 2027 / 2028
                </p>
              </div>
            </div>
            <span className="self-start sm:self-auto text-xs bg-white/20 text-white font-bold px-3 py-1 rounded-full border border-white/30">
              Jalur Reguler • T.A. 2027/2028
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Tabel SPA & SPP 3 Gelombang */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <CalendarClock className="w-4 h-4 text-blue-600" />
                  <span>Rincian Biaya (SPA & SPP) Per Gelombang:</span>
                </h4>
                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                  Tahun Akademik 2027 / 2028
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100/90 text-slate-700 uppercase text-[11px] font-extrabold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Gelombang & Periode</th>
                      <th className="py-3 px-4 text-right">SPA</th>
                      <th className="py-3 px-4 text-right">SPP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {BIAYA_KELAS_REGULER.map((item, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-extrabold text-slate-900 block sm:inline mr-2">{item.nama}</span>
                          <span className="text-xs text-slate-500">({item.periode})</span>
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
              <div className="mt-2.5 flex flex-col sm:flex-row justify-between text-[11px] text-slate-500 gap-1 bg-blue-50/60 p-2.5 rounded-xl border border-blue-200/50">
                <span><strong>SPA</strong> = Sumbangan Pengembangan Akademik (dibayar di awal per gelombang)</span>
                <span><strong>SPP</strong> = Sumbangan Pembinaan Pendidikan per semester</span>
              </div>
            </div>

            {/* Persyaratan Pendaftaran Reguler */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Persyaratan Berkas Pendaftaran (Kelas Reguler):</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PERSYARATAN_KELAS_REGULER.map((syarat, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:bg-blue-50/40 hover:border-blue-200 transition-colors text-xs text-slate-800"
                  >
                    <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="font-medium">{syarat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Informasi Biaya & Persyaratan Kelas Karyawan */}
      {program === 'karyawan' && (
        <div className="max-w-3xl mx-auto mb-8 bg-white rounded-3xl shadow-xl shadow-amber-900/5 border border-amber-200/90 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white px-6 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/15 text-amber-200">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  Biaya Pendidikan & Persyaratan Kelas Karyawan
                </h3>
                <p className="text-xs text-amber-100">
                  Sekolah Tinggi Arsitektur YKPN (STARS YKPN) Yogyakarta • T.A. 2027 / 2028
                </p>
              </div>
            </div>
            <span className="self-start sm:self-auto text-xs bg-black/20 text-amber-200 font-bold px-3 py-1 rounded-full border border-amber-400/30">
              Jalur Karyawan • T.A. 2027/2028
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Box Biaya SPA & SPP Kelas Karyawan */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span>Rincian Biaya Kuliah Kelas Karyawan:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
                  <span className="text-xs text-amber-900 font-semibold uppercase tracking-wider">SPA (Sumbangan Pengembangan Akademik)</span>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{BIAYA_KELAS_KARYAWAN.spa}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Dibayarkan saat awal registrasi masuk.</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
                  <span className="text-xs text-amber-900 font-semibold uppercase tracking-wider">SPP (Sumbangan Pembinaan Pendidikan)</span>
                  <p className="text-2xl font-extrabold text-amber-800 mt-1 font-mono">{BIAYA_KELAS_KARYAWAN.spp}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Biaya per semester perkuliahan fleksibel.</p>
                </div>
              </div>
            </div>

            {/* Persyaratan Pendaftaran Kelas Karyawan (11 Item) */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>Persyaratan Berkas Pendaftaran (11 Dokumen):</span>
                </h4>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Termasuk CV & Portofolio
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PERSYARATAN_KELAS_KARYAWAN.map((syarat, idx) => {
                  const isExtra = idx >= 8; // CV, Portofolio, Surat Kerja
                  return (
                    <div 
                      key={idx} 
                      className={`flex items-center gap-2.5 p-3 rounded-xl border transition-colors text-xs ${
                        isExtra 
                          ? 'bg-amber-50/90 border-amber-300 font-semibold text-amber-950 ring-1 ring-amber-400/30' 
                          : 'bg-slate-50/80 border-slate-200/80 text-slate-800'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                        isExtra ? 'bg-amber-600 text-white' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span>{syarat}</span>
                      {isExtra && (
                        <span className="ml-auto text-[10px] uppercase font-bold text-amber-800 bg-amber-200/60 px-1.5 py-0.5 rounded">
                          Khusus Karyawan
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500 mt-3 italic">
                * Berkas persyaratan diserahkan saat verifikasi registrasi atau dikirimkan melalui koordinasi WhatsApp Panitia PMB STARS YKPN.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Form Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden">
        {/* Banner inside card */}
        <div className={`px-6 sm:px-8 py-5 border-b flex items-center justify-between ${
          program === 'reguler' 
            ? 'bg-gradient-to-r from-blue-900 to-indigo-900 text-white' 
            : 'bg-gradient-to-r from-slate-900 to-amber-950 text-white'
        }`}>
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-amber-400">
              Formulir Pendaftaran Resmi
            </span>
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 mt-0.5">
              <span>{program === 'reguler' ? 'Formulir Kelas Reguler' : 'Formulir Kelas Karyawan'}</span>
            </h2>
          </div>
          <div className="hidden sm:block text-right">
            <span className="text-xs text-slate-300">Program Studi Sarjana (S1)</span>
            <p className="text-sm font-semibold text-amber-300">Arsitektur</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {/* Gelombang Selection for Kelas Reguler */}
          {program === 'reguler' && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-blue-950 mb-2">
                Pilihan Gelombang Pendaftaran (Kelas Reguler) <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {BIAYA_KELAS_REGULER.map((gel) => {
                  const gelValue = `${gel.nama} (${gel.periode})`;
                  const isSelected = formData.gelombang === gelValue;
                  return (
                    <button
                      key={gel.nama}
                      type="button"
                      onClick={() => handleInputChange('gelombang', gelValue)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-white ring-2 ring-blue-500 shadow-md'
                          : 'border-blue-200 bg-white/70 hover:bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-sm text-blue-900">{gel.nama}</span>
                        {isSelected && <Check className="w-4 h-4 text-blue-600 stroke-[3]" />}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">{gel.periode}</p>
                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex justify-between text-[11px]">
                        <span className="text-slate-500">SPA:</span>
                        <span className="font-bold text-slate-900">{gel.spa}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">SPP:</span>
                        <span className="font-bold text-blue-800">{gel.spp}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Info Ringkas Biaya & Dokumen untuk Kelas Karyawan */}
          {program === 'karyawan' && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-900 uppercase">Jalur Kelas Karyawan</span>
                  <span className="text-[10px] bg-amber-600 text-white font-bold px-2 py-0.5 rounded-full">SPA & SPP Rp 7 Juta</span>
                </div>
                <p className="text-xs text-slate-700 mt-0.5">
                  Biaya: <strong>SPA Rp. 7.000.000,-</strong> & <strong>SPP Rp. 7.000.000,-</strong> per semester.
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Persyaratan tambahan: Curiculum Vitae (CV), Portofolio karya, dan Surat Keterangan Kerja.
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-xs font-bold text-amber-900 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>11 Dokumen Terverifikasi</span>
              </div>
            </div>
          )}

          {/* 1. Nama Lengkap */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">
              1. Nama Lengkap <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Bagus Pratama Wicaksono (sesuai Ijazah/KTP)"
              value={formData.namaLengkap}
              onChange={e => handleInputChange('namaLengkap', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 ${
                errors.namaLengkap
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-amber-500 focus:ring-amber-200'
              }`}
            />
            {errors.namaLengkap && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.namaLengkap}</p>
            )}
          </div>

          {/* 2. Alamat */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">
              2. Alamat Tempat Tinggal / Domisili <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <textarea
                rows={3}
                placeholder="Contoh: Jl. Kaliurang KM 8.5, Sinduharjo, Ngaglik, Sleman, D.I. Yogyakarta 55581"
                value={formData.alamat}
                onChange={e => handleInputChange('alamat', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 ${
                  errors.alamat
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-amber-500 focus:ring-amber-200'
                }`}
              />
            </div>
            {errors.alamat && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.alamat}</p>
            )}
          </div>

          {/* 3. Asal Sekolah ATAU Asal Sekolah / Perusahaan */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">
              3. {program === 'reguler' ? 'Asal Sekolah' : 'Asal Sekolah / Perusahaan'}{' '}
              <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                {program === 'reguler' ? <School className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
              </div>
              <input
                type="text"
                placeholder={
                  program === 'reguler'
                    ? 'Contoh: SMAN 1 Yogyakarta / SMK Negeri 2 Depok Sleman'
                    : 'Contoh: PT. Cipta Graha Studio (Drafter) / Lulusan SMKN 2 Depok'
                }
                value={formData.asalSekolahOrPerusahaan}
                onChange={e => handleInputChange('asalSekolahOrPerusahaan', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-slate-50/50 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 ${
                  errors.asalSekolahOrPerusahaan
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-amber-500 focus:ring-amber-200'
                }`}
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {program === 'reguler'
                ? 'Tuliskan nama sekolah asal SMA / SMK / MA Anda.'
                : 'Tuliskan nama instansi/perusahaan tempat Anda bekerja saat ini atau pendidikan terakhir.'}
            </p>
            {errors.asalSekolahOrPerusahaan && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.asalSekolahOrPerusahaan}</p>
            )}
          </div>

          {/* 4 & 5. WhatsApp Section in 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* 4. No. Whatsapp Aktif */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">
                4. No. Whatsapp Aktif Calon Mahasiswa <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600 font-medium text-xs">
                  WA
                </div>
                <input
                  type="tel"
                  placeholder="081234567890"
                  value={formData.noWaAktif}
                  onChange={e => handleInputChange('noWaAktif', e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-slate-50/50 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 ${
                    errors.noWaAktif
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-300 focus:border-amber-500 focus:ring-amber-200'
                  }`}
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Akan digunakan untuk informasi seleksi dan grup PMB.</p>
              {errors.noWaAktif && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.noWaAktif}</p>
              )}
            </div>

            {/* 5. No. Whatsapp Orangtua / Wali */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">
                5. No. Whatsapp Orangtua / Wali <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600 font-medium text-xs">
                  WA
                </div>
                <input
                  type="tel"
                  placeholder="081398765432"
                  value={formData.noWaOrtu}
                  onChange={e => handleInputChange('noWaOrtu', e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-slate-50/50 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 ${
                    errors.noWaOrtu
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-300 focus:border-amber-500 focus:ring-amber-200'
                  }`}
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Kontak darurat & informasi akademik orangtua.</p>
              {errors.noWaOrtu && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.noWaOrtu}</p>
              )}
            </div>
          </div>

          {/* 6. Alamat Email */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">
              6. Alamat Email Aktif <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="nama.anda@gmail.com"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-slate-50/50 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-amber-500 focus:ring-amber-200'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.email}</p>
            )}
          </div>

          {/* 7. Alasan mendaftar */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">
              7. Alasan mendaftar di Sekolah Tinggi Arsitektur YKPN Yogyakarta <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Ceritakan motivasi Anda memilih STARS YKPN Yogyakarta, minat Anda dalam bidang arsitektur, atau cita-cita Anda di masa depan..."
              value={formData.alasanMendaftar}
              onChange={e => handleInputChange('alasanMendaftar', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 ${
                errors.alasanMendaftar
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-amber-500 focus:ring-amber-200'
              }`}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-[11px] text-slate-500">Minimal 15 karakter uraian motivasi.</p>
              <span className="text-[11px] text-slate-400">{formData.alasanMendaftar.length} karakter</span>
            </div>
            {errors.alasanMendaftar && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.alasanMendaftar}</p>
            )}
          </div>

          {/* 8. Info dapat darimana? */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-sm font-bold text-slate-800 mb-2">
              8. Info Sekolah Tinggi Arsitektur YKPN Yogyakarta dapat darimana? <span className="text-rose-500">*</span>
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {INFO_SOURCES.map((source) => {
                const isSelected = formData.infoDapatDari === source;
                return (
                  <button
                    key={source}
                    type="button"
                    onClick={() => handleInputChange('infoDapatDari', source)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/80 text-amber-950 ring-1 ring-amber-500 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{source}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                      isSelected ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Input for 'Lainnya' */}
            {formData.infoDapatDari === 'Lainnya' && (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Sebutkan dari mana Anda mengetahui STARS YKPN..."
                  value={formData.infoDapatDariDetail || ''}
                  onChange={e => handleInputChange('infoDapatDariDetail', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    errors.infoDapatDariDetail
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-300 focus:border-amber-500 focus:ring-amber-200'
                  }`}
                />
                {errors.infoDapatDariDetail && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">{errors.infoDapatDariDetail}</p>
                )}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 text-sm font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Reset Formulir</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>Memproses Pendaftaran...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>Kirim Pendaftaran ({program === 'reguler' ? 'Reguler' : 'Karyawan'})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {submittedRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center relative overflow-hidden">
            {/* Top decorative stripe */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Pendaftaran Berhasil Dikirim
            </span>

            <h3 className="text-2xl font-extrabold text-slate-900 mt-3">
              Selamat, {submittedRegistration.namaLengkap}!
            </h3>

            <p className="text-sm text-slate-600 mt-2">
              Formulir penerimaan mahasiswa baru <strong>{submittedRegistration.program === 'reguler' ? 'Kelas Reguler' : 'Kelas Karyawan'}</strong> STARS YKPN Yogyakarta Anda telah berhasil disimpan dalam sistem.
            </p>

            {/* Registration Ticket box */}
            <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-2">
                <span className="text-xs font-semibold text-slate-500">Nomor Registrasi:</span>
                <span className="font-mono font-bold text-blue-900 text-base">{submittedRegistration.id}</span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <p><strong>Program:</strong> {submittedRegistration.program === 'reguler' ? 'Kelas Reguler (Pagi/Siang)' : 'Kelas Karyawan (Sore/Malam)'}</p>
                {submittedRegistration.gelombang && (
                  <p><strong>Gelombang:</strong> <span className="text-amber-800 font-bold">{submittedRegistration.gelombang}</span></p>
                )}
                <p><strong>{submittedRegistration.program === 'reguler' ? 'Asal Sekolah' : 'Asal Sekolah/Perusahaan'}:</strong> {submittedRegistration.asalSekolahOrPerusahaan}</p>
                <p><strong>No. WA:</strong> {submittedRegistration.noWaAktif}</p>
                <p><strong>Email:</strong> {submittedRegistration.email}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => exportSingleRegistrationPdf(submittedRegistration)}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-semibold text-sm shadow-md transition-colors"
              >
                <FileDown className="w-4 h-4 text-amber-400" />
                <span>Unduh Tanda Bukti Pendaftaran (PDF)</span>
              </button>

              <a
                href={`https://wa.me/6281234567890?text=Halo%20Panitia%20PMB%20STARS%20YKPN,%20saya%20sudah%20mendaftar%20dengan%20No%20Registrasi%20${submittedRegistration.id}%20atas%20nama%20${encodeURIComponent(submittedRegistration.namaLengkap)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Konfirmasi ke WhatsApp Panitia PMB</span>
              </a>

              <button
                type="button"
                onClick={handleNewRegistration}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-medium transition-colors"
              >
                <span>Isi Formulir Pendaftaran Baru Lainnya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
