import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  MessageSquare, 
  Users, 
  GraduationCap, 
  Briefcase, 
  Calendar, 
  CheckCircle, 
  Clock, 
  PhoneCall, 
  Plus, 
  RotateCcw, 
  X, 
  Download, 
  Building2,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Cloud,
  LayoutGrid,
  List
} from 'lucide-react';
import { Registration, ProgramType, RegistrationStatus, RegistrationFormData } from '../types';
import { exportToExcel, exportToPdf, exportSingleRegistrationPdf, formatDateIndo, formatDateShort } from '../utils/exportUtils';
import { INFO_SOURCES, BIAYA_KELAS_REGULER, BIAYA_KELAS_KARYAWAN } from '../data/initialData';

interface AdminDashboardProps {
  registrations: Registration[];
  onUpdateStatus: (id: string, status: RegistrationStatus, notes?: string) => void;
  onDeleteRegistration: (id: string) => void;
  onAddManualRegistration: (formData: RegistrationFormData) => void;
  onResetSampleData: () => void;
  onRefreshCloud?: () => void;
  isSyncing?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  registrations,
  onUpdateStatus,
  onDeleteRegistration,
  onAddManualRegistration,
  onResetSampleData,
  onRefreshCloud,
  isSyncing = false,
}) => {
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<'all' | ProgramType>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | RegistrationStatus>('all');
  const [viewMode, setViewMode] = useState<'adaptive' | 'cards' | 'table'>('adaptive');

  // Modals
  const [viewingRegistration, setViewingRegistration] = useState<Registration | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  // Form for manual entry
  const [manualForm, setManualForm] = useState<RegistrationFormData>({
    program: 'reguler',
    namaLengkap: '',
    alamat: '',
    asalSekolahOrPerusahaan: '',
    noWaAktif: '',
    noWaOrtu: '',
    email: '',
    alasanMendaftar: '',
    infoDapatDari: INFO_SOURCES[0],
  });

  // Filtered List
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((item) => {
      // Program filter
      if (selectedProgram !== 'all' && item.program !== selectedProgram) {
        return false;
      }
      // Source filter
      if (selectedSource !== 'all' && item.infoDapatDari !== selectedSource) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.namaLengkap.toLowerCase().includes(query);
        const matchesSchool = item.asalSekolahOrPerusahaan.toLowerCase().includes(query);
        const matchesWa = item.noWaAktif.toLowerCase().includes(query);
        const matchesEmail = item.email.toLowerCase().includes(query);
        const matchesId = item.id.toLowerCase().includes(query);
        return matchesName || matchesSchool || matchesWa || matchesEmail || matchesId;
      }
      return true;
    });
  }, [registrations, selectedProgram, selectedSource, selectedStatus, searchQuery]);

  // Statistics
  const totalCount = registrations.length;
  const regulerCount = registrations.filter(r => r.program === 'reguler').length;
  const karyawanCount = registrations.filter(r => r.program === 'karyawan').length;
  const newCount = registrations.filter(r => r.status === 'baru').length;

  const handleOpenDetail = (reg: Registration) => {
    setViewingRegistration(reg);
    setAdminNotes(reg.catatanAdmin || '');
  };

  const handleSaveNotes = () => {
    if (viewingRegistration) {
      onUpdateStatus(viewingRegistration.id, viewingRegistration.status, adminNotes);
      setViewingRegistration(prev => prev ? { ...prev, catatanAdmin: adminNotes } : null);
      alert('Catatan pendaftar berhasil disimpan!');
    }
  };

  const handleStatusChangeInModal = (newStatus: RegistrationStatus) => {
    if (viewingRegistration) {
      onUpdateStatus(viewingRegistration.id, newStatus, adminNotes);
      setViewingRegistration(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.namaLengkap || !manualForm.noWaAktif || !manualForm.email) {
      alert('Nama, No. WA, dan Email wajib diisi.');
      return;
    }
    onAddManualRegistration(manualForm);
    setIsAddModalOpen(false);
    setManualForm({
      program: 'reguler',
      namaLengkap: '',
      alamat: '',
      asalSekolahOrPerusahaan: '',
      noWaAktif: '',
      noWaOrtu: '',
      email: '',
      alasanMendaftar: '',
      infoDapatDari: INFO_SOURCES[0],
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 p-1.5 flex items-center justify-center border border-amber-500/40 shadow-md ring-2 ring-amber-400/20 shrink-0">
            <img
              src="/assets/aistudio/image_84723e49.png"
              alt="Logo STARS YKPN"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-md bg-blue-900 text-amber-400 font-bold text-xs uppercase tracking-wide">
                Portal Administrator
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
                T.A. 2027 / 2028
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Database Cloud Firestore Aktif
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Data Calon Mahasiswa Baru (T.A. 2027/2028)
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Kelola seluruh formulir pendaftaran Kelas Reguler dan Kelas Karyawan, serta lakukan ekspor ke PDF & Excel.
            </p>
          </div>
        </div>

        {/* Action Buttons: Sync Cloud, Export to Excel & PDF */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          {onRefreshCloud && (
            <button
              type="button"
              onClick={onRefreshCloud}
              disabled={isSyncing}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-semibold text-xs sm:text-sm shadow-sm transition-all disabled:opacity-50"
              title="Sinkronkan pembaruan data terkini dari Cloud Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="truncate">{isSyncing ? 'Menyinkronkan...' : 'Sinkron Cloud'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => exportToExcel(filteredRegistrations)}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Download file Excel data pendaftar"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-200" />
            <span className="truncate">Export Excel</span>
          </button>

          <button
            type="button"
            onClick={() => exportToPdf(filteredRegistrations)}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Cetak & Download rekapitulasi PDF"
          >
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-200" />
            <span className="truncate">Export PDF</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-semibold text-xs sm:text-sm shadow-md transition-all"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="truncate">Tambah Data</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2.5 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase truncate">Total Pendaftar</p>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{totalCount}</p>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2.5 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase truncate">Kelas Reguler</p>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{regulerCount}</p>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2.5 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase truncate">Kelas Karyawan</p>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{karyawanCount}</p>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2.5 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase truncate">Perlu Tindak Lanjut</p>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{newCount}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search box */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Cari nama lengkap, asal sekolah/perusahaan, nomor WA, atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Program Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedProgram('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedProgram === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setSelectedProgram('reguler')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedProgram === 'reguler'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Reguler ({regulerCount})
            </button>
            <button
              type="button"
              onClick={() => setSelectedProgram('karyawan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedProgram === 'karyawan'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Karyawan ({karyawanCount})
            </button>
          </div>
        </div>

        {/* Secondary filters: Source & Status */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold">Filter Lanjutan:</span>
          </div>

          {/* Source Dropdown */}
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">Semua Sumber Info</option>
            {INFO_SOURCES.map((src) => (
              <option key={src} value={src}>{src}</option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">Semua Status</option>
            <option value="baru">Baru</option>
            <option value="diverifikasi">Diverifikasi</option>
            <option value="dihubungi">Dihubungi</option>
            <option value="diterima">Diterima</option>
          </select>

          {(selectedSource !== 'all' || selectedStatus !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedProgram('all');
                setSelectedSource('all');
                setSelectedStatus('all');
                setSearchQuery('');
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium underline ml-auto"
            >
              Reset Semua Filter
            </button>
          )}

          <button
            type="button"
            onClick={onResetSampleData}
            title="Muat ulang contoh data pendaftar"
            className="ml-auto inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Data Sample</span>
          </button>
        </div>
      </div>

      {/* Registrations List / Table Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">
              Daftar Calon Mahasiswa ({filteredRegistrations.length} data)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelas Reguler & Kelas Karyawan STARS YKPN (T.A. 2027/2028)
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tampilan Kartu (Sangat ramah HP)"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-amber-600" />
              <span>Kartu</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tampilan Tabel"
            >
              <List className="w-3.5 h-3.5 text-blue-600" />
              <span>Tabel</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('adaptive')}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'adaptive'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Otomatis (Kartu di HP, Tabel di Laptop)"
            >
              <span>Auto</span>
            </button>
          </div>
        </div>

        {filteredRegistrations.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-slate-600 font-semibold text-sm">Tidak ada data pendaftar yang cocok.</p>
            <p className="text-xs text-slate-400 mt-1">Coba ubah kata kunci pencarian atau bersihkan filter.</p>
          </div>
        ) : (
          <>
            {/* 1. Mobile Cards View (Shown on mobile when adaptive, or always when cards mode selected) */}
            <div className={`${viewMode === 'table' ? 'hidden' : viewMode === 'cards' ? 'block' : 'block md:hidden'} p-3.5 sm:p-5 space-y-3.5 bg-slate-50/50 divide-y-0`}>
              {filteredRegistrations.map((item, index) => {
                const isReguler = item.program === 'reguler';
                return (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3"
                  >
                    {/* Header Row: ID, Program, Date */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                          {item.id}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isReguler 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {isReguler ? <GraduationCap className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                          {isReguler ? 'Reguler' : 'Karyawan'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {formatDateShort(item.createdAt)}
                      </span>
                    </div>

                    {/* Candidate Name & School */}
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                        {item.namaLengkap}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        {item.asalSekolahOrPerusahaan}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {item.alamat}
                      </p>
                    </div>

                    {/* WhatsApp Quick Action Buttons for Mobile */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={`https://wa.me/${item.noWaAktif.replace(/[^0-9]/g, '').replace(/^0/, '62')}?text=Halo%20${encodeURIComponent(item.namaLengkap)},%20kami%20dari%20Panitia%20PMB%20STARS%20YKPN%20Yogyakarta...`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm"
                        title="Chat WhatsApp Calon Mahasiswa"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="truncate">WA Calon</span>
                      </a>

                      <a
                        href={`https://wa.me/${item.noWaOrtu.replace(/[^0-9]/g, '').replace(/^0/, '62')}?text=Halo%20Bapak/Ibu%20Wali%20dari%20${encodeURIComponent(item.namaLengkap)},%20kami%20dari%20Panitia%20PMB%20STARS%20YKPN...`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-semibold text-xs transition-colors"
                        title="Chat WhatsApp Ortu/Wali"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                        <span className="truncate">WA Ortu</span>
                      </a>
                    </div>

                    {/* Status & Action Bar */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      {/* Direct Status Selector */}
                      <div className="flex-1 max-w-[150px]">
                        <select
                          value={item.status}
                          onChange={(e) => onUpdateStatus(item.id, e.target.value as RegistrationStatus)}
                          className={`w-full px-2 py-1.5 rounded-lg text-[11px] font-bold border focus:outline-none ${
                            item.status === 'diterima'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : item.status === 'diverifikasi'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : item.status === 'dihubungi'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-slate-50 text-slate-700 border-slate-300'
                          }`}
                        >
                          <option value="baru">Baru</option>
                          <option value="diverifikasi">Diverifikasi</option>
                          <option value="dihubungi">Dihubungi</option>
                          <option value="diterima">Diterima</option>
                        </select>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(item)}
                          className="p-2 rounded-xl text-slate-600 hover:text-blue-700 hover:bg-blue-50 bg-slate-100 transition-colors"
                          title="Lihat Detail Lengkap"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => exportSingleRegistrationPdf(item)}
                          className="p-2 rounded-xl text-slate-600 hover:text-amber-700 hover:bg-amber-50 bg-slate-100 transition-colors"
                          title="Unduh Kartu PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Hapus data pendaftar ${item.namaLengkap} (${item.id})?`)) {
                              onDeleteRegistration(item.id);
                            }
                          }}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 bg-slate-100 transition-colors"
                          title="Hapus Data"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 2. Desktop Table View (Shown on desktop when adaptive, or always when table mode selected) */}
            <div className={`${viewMode === 'cards' ? 'hidden' : viewMode === 'table' ? 'block' : 'hidden md:block'} overflow-x-auto`}>
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5 text-center">No</th>
                    <th className="px-4 py-3.5">No. Reg / Tgl</th>
                    <th className="px-4 py-3.5">Program</th>
                    <th className="px-4 py-3.5">Nama Lengkap & Email</th>
                    <th className="px-4 py-3.5">Asal Sekolah / Perusahaan</th>
                    <th className="px-4 py-3.5">WhatsApp</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRegistrations.map((item, index) => {
                    const isReguler = item.program === 'reguler';
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3.5 text-center font-medium text-slate-400">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="font-mono font-bold text-slate-900 block">{item.id}</span>
                          <span className="text-[10px] text-slate-400">{formatDateShort(item.createdAt)}</span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isReguler 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-amber-100 text-amber-900'
                          }`}>
                            {isReguler ? <GraduationCap className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                            {isReguler ? 'Reguler' : 'Karyawan'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-slate-900 text-sm">{item.namaLengkap}</div>
                          <div className="text-[11px] text-slate-500">{item.email}</div>
                        </td>
                        <td className="px-4 py-3.5 max-w-[200px] truncate" title={item.asalSekolahOrPerusahaan}>
                          <div className="font-medium text-slate-800">{item.asalSekolahOrPerusahaan}</div>
                          <div className="text-[10px] text-slate-400 truncate">{item.alamat}</div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`https://wa.me/${item.noWaAktif.replace(/[^0-9]/g, '').replace(/^0/, '62')}?text=Halo%20${encodeURIComponent(item.namaLengkap)},%20kami%20dari%20Panitia%20PMB%20STARS%20YKPN%20Yogyakarta...`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded transition-colors"
                              title="Chat WhatsApp Calon Mahasiswa"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>{item.noWaAktif}</span>
                            </a>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Ortu: {item.noWaOrtu}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <select
                            value={item.status}
                            onChange={(e) => onUpdateStatus(item.id, e.target.value as RegistrationStatus)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer ${
                              item.status === 'diterima'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : item.status === 'diverifikasi'
                                ? 'bg-blue-100 text-blue-800 border-blue-300'
                                : item.status === 'dihubungi'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            <option value="baru">Baru</option>
                            <option value="diverifikasi">Diverifikasi</option>
                            <option value="dihubungi">Dihubungi</option>
                            <option value="diterima">Diterima</option>
                          </select>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-center">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenDetail(item)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                              title="Lihat Detail Pendaftar"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => exportSingleRegistrationPdf(item)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                              title="Unduh Kartu Pendaftaran (PDF)"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Hapus data pendaftar ${item.namaLengkap} (${item.id})?`)) {
                                  onDeleteRegistration(item.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Hapus Data"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {viewingRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-slate-900 p-1 flex items-center justify-center border border-amber-500/30 shadow-sm shrink-0 overflow-hidden">
                  <img
                    src="/assets/aistudio/image_84723e49.png"
                    alt="Logo STARS YKPN"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                    Detail Pendaftar: {viewingRegistration.namaLengkap}
                  </h3>
                  <span className="text-xs font-mono font-bold text-blue-800">
                    {viewingRegistration.id} • {viewingRegistration.program === 'reguler' ? 'Kelas Reguler' : 'Kelas Karyawan'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingRegistration(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="py-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-medium block">1. Nama Lengkap:</span>
                  <span className="font-bold text-slate-900 text-base">{viewingRegistration.namaLengkap}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">
                    3. {viewingRegistration.program === 'reguler' ? 'Asal Sekolah' : 'Asal Sekolah / Perusahaan'}:
                  </span>
                  <span className="font-semibold text-slate-800">{viewingRegistration.asalSekolahOrPerusahaan}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 font-medium block">2. Alamat Lengkap / Domisili:</span>
                  <span className="text-slate-800">{viewingRegistration.alamat}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">4. No. WhatsApp Aktif:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-bold text-slate-900">{viewingRegistration.noWaAktif}</span>
                    <a
                      href={`https://wa.me/${viewingRegistration.noWaAktif.replace(/[^0-9]/g, '').replace(/^0/, '62')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[11px] font-semibold inline-flex items-center gap-1 hover:bg-emerald-700"
                    >
                      <MessageSquare className="w-3 h-3" />
                      Chat WA
                    </a>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">5. No. WhatsApp Ortu / Wali:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-semibold text-slate-800">{viewingRegistration.noWaOrtu}</span>
                    <a
                      href={`https://wa.me/${viewingRegistration.noWaOrtu.replace(/[^0-9]/g, '').replace(/^0/, '62')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-semibold inline-flex items-center gap-1 hover:bg-emerald-200"
                    >
                      <PhoneCall className="w-3 h-3" />
                      Chat Ortu
                    </a>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">6. Alamat Email:</span>
                  <a href={`mailto:${viewingRegistration.email}`} className="text-blue-700 font-medium underline">
                    {viewingRegistration.email}
                  </a>
                </div>
                {viewingRegistration.gelombang && (
                  <div>
                    <span className="text-slate-400 font-medium block">Pilihan Gelombang (Karyawan):</span>
                    <span className="font-bold text-amber-800">{viewingRegistration.gelombang}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-400 font-medium block">8. Info STARS YKPN dari:</span>
                  <span className="font-semibold text-slate-800">
                    {viewingRegistration.infoDapatDari}
                    {viewingRegistration.infoDapatDariDetail ? ` (${viewingRegistration.infoDapatDariDetail})` : ''}
                  </span>
                </div>
              </div>

              {/* 7. Alasan Mendaftar */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                <span className="text-amber-900 font-bold block mb-1">
                  7. Alasan Mendaftar di Sekolah Tinggi Arsitektur YKPN Yogyakarta:
                </span>
                <p className="text-slate-800 italic leading-relaxed">
                  "{viewingRegistration.alasanMendaftar}"
                </p>
              </div>

              {/* Status and Notes */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Ubah Status Pendaftaran:
                  </label>
                  <div className="flex gap-1.5">
                    {(['baru', 'diverifikasi', 'dihubungi', 'diterima'] as RegistrationStatus[]).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleStatusChangeInModal(st)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                          viewingRegistration.status === st
                            ? 'bg-slate-900 text-amber-400 ring-2 ring-amber-400'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1">
                    Catatan Internal Admin / Panitia PMB:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Sudah dijadwalkan wawancara portofolio hari Sabtu..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    className="mt-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold"
                  >
                    Simpan Catatan
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => exportSingleRegistrationPdf(viewingRegistration)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Unduh Bukti Pendaftaran PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setViewingRegistration(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Entry Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="font-bold text-lg text-slate-900">Tambah Data Pendaftar Manual</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4 py-4 text-xs sm:text-sm">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setManualForm(prev => ({ ...prev, program: 'reguler' }))}
                  className={`flex-1 py-2 rounded-xl font-bold border ${manualForm.program === 'reguler' ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-slate-700'}`}
                >
                  Kelas Reguler
                </button>
                <button
                  type="button"
                  onClick={() => setManualForm(prev => ({ ...prev, program: 'karyawan' }))}
                  className={`flex-1 py-2 rounded-xl font-bold border ${manualForm.program === 'karyawan' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-700'}`}
                >
                  Kelas Karyawan
                </button>
              </div>

              {manualForm.program === 'reguler' && (
                <div>
                  <label className="font-bold block text-slate-700 mb-1">Pilihan Gelombang (Kelas Reguler)</label>
                  <select
                    value={manualForm.gelombang || `${BIAYA_KELAS_REGULER[0].nama} (${BIAYA_KELAS_REGULER[0].periode})`}
                    onChange={e => setManualForm(p => ({ ...p, gelombang: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border text-xs"
                  >
                    {BIAYA_KELAS_REGULER.map(g => (
                      <option key={g.nama} value={`${g.nama} (${g.periode})`}>
                        {g.nama} ({g.periode}) - SPA: {g.spa} / SPP: {g.spp}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {manualForm.program === 'karyawan' && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  <p className="font-bold">Biaya Kelas Karyawan:</p>
                  <p>SPA: {BIAYA_KELAS_KARYAWAN.spa} | SPP: {BIAYA_KELAS_KARYAWAN.spp} per semester</p>
                </div>
              )}

              <div>
                <label className="font-bold block text-slate-700 mb-1">1. Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={manualForm.namaLengkap}
                  onChange={e => setManualForm(p => ({ ...p, namaLengkap: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border"
                />
              </div>

              <div>
                <label className="font-bold block text-slate-700 mb-1">2. Alamat Lengkap</label>
                <textarea
                  rows={2}
                  required
                  value={manualForm.alamat}
                  onChange={e => setManualForm(p => ({ ...p, alamat: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border"
                />
              </div>

              <div>
                <label className="font-bold block text-slate-700 mb-1">
                  3. {manualForm.program === 'reguler' ? 'Asal Sekolah' : 'Asal Sekolah / Perusahaan'}
                </label>
                <input
                  type="text"
                  required
                  value={manualForm.asalSekolahOrPerusahaan}
                  onChange={e => setManualForm(p => ({ ...p, asalSekolahOrPerusahaan: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block text-slate-700 mb-1">4. No. WA Aktif</label>
                  <input
                    type="tel"
                    required
                    value={manualForm.noWaAktif}
                    onChange={e => setManualForm(p => ({ ...p, noWaAktif: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border"
                  />
                </div>
                <div>
                  <label className="font-bold block text-slate-700 mb-1">5. No. WA Ortu/Wali</label>
                  <input
                    type="tel"
                    required
                    value={manualForm.noWaOrtu}
                    onChange={e => setManualForm(p => ({ ...p, noWaOrtu: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block text-slate-700 mb-1">6. Alamat Email</label>
                <input
                  type="email"
                  required
                  value={manualForm.email}
                  onChange={e => setManualForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border"
                />
              </div>

              <div>
                <label className="font-bold block text-slate-700 mb-1">7. Alasan Mendaftar</label>
                <textarea
                  rows={2}
                  required
                  value={manualForm.alasanMendaftar}
                  onChange={e => setManualForm(p => ({ ...p, alasanMendaftar: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border"
                />
              </div>

              <div>
                <label className="font-bold block text-slate-700 mb-1">8. Info STARS YKPN dari</label>
                <select
                  value={manualForm.infoDapatDari}
                  onChange={e => setManualForm(p => ({ ...p, infoDapatDari: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border"
                >
                  {INFO_SOURCES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                >
                  Simpan Pendaftar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
