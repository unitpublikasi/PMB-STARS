import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  LogOut, 
  FileText, 
  UserCheck, 
  PhoneCall, 
  Info, 
  Cloud, 
  Menu, 
  X,
  MessageSquare
} from 'lucide-react';
import { AdminUser } from '../types';
import { KONTAK_PANITIA_PMB } from '../data/initialData';

interface NavbarProps {
  currentView: 'form' | 'admin' | 'info';
  onNavigate: (view: 'form' | 'admin' | 'info') => void;
  adminUser: AdminUser | null;
  onLogout: () => void;
  isCloudConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  adminUser,
  onLogout,
  isCloudConnected = true,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (view: 'form' | 'admin' | 'info') => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white transition-all shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
          {/* Logo & Campus Identity */}
          <button
            onClick={() => handleNavClick('form')}
            className="flex items-center gap-2.5 sm:gap-3.5 text-left group focus:outline-none min-w-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-800/90 p-1 flex items-center justify-center shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-transform duration-200 ring-2 ring-amber-400/40 overflow-hidden shrink-0">
              <img
                src="/assets/aistudio/image_84723e49.png"
                alt="Logo STARS YKPN"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold tracking-tight text-lg sm:text-xl text-white group-hover:text-amber-400 transition-colors truncate">
                  STARS YKPN
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                  JOGJA
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 hidden sm:block font-medium truncate">
                Sekolah Tinggi Arsitektur YKPN • PMB T.A. 2027/2028
              </p>
              <p className="text-[10px] text-slate-400 sm:hidden truncate">
                Penerimaan Mahasiswa Baru
              </p>
            </div>
          </button>

          {/* Desktop Navigation Items (Hidden on small screens) */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleNavClick('form')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                currentView === 'form'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Formulir PMB</span>
            </button>

            <button
              onClick={() => handleNavClick('info')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                currentView === 'info'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>Tentang STARS YKPN</span>
            </button>

            {/* Cloud Firestore Status Badge */}
            <div 
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                isCloudConnected 
                  ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40' 
                  : 'bg-amber-950/50 text-amber-300 border-amber-500/40'
              }`}
              title={isCloudConnected ? "Cloud Firestore Tersinkronisasi Otomatis" : "Sedang Menyambungkan ke Cloud Firestore..."}
            >
              <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <Cloud className="w-3.5 h-3.5" />
              <span>{isCloudConnected ? 'Cloud Sync' : 'Menghubungkan'}</span>
            </div>

            {/* Admin button / status */}
            {adminUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    currentView === 'admin'
                      ? 'bg-emerald-600 text-white shadow-md font-bold'
                      : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900/60'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-emerald-300" />
                  <span>Admin Panel</span>
                </button>
                <button
                  onClick={onLogout}
                  title="Keluar dari Admin"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  currentView === 'admin'
                    ? 'bg-slate-800 text-amber-400 border border-amber-500/40 shadow-inner'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Portal Admin</span>
              </button>
            )}
          </div>

          {/* Mobile Right Controls: Cloud Indicator & Hamburger Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <div 
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                isCloudConnected 
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40' 
                  : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
              }`}
              title={isCloudConnected ? "Cloud Sync Aktif" : "Menghubungkan..."}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isCloudConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <Cloud className="w-3 h-3" />
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              aria-label="Menu Navigasi"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-amber-400" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/98 backdrop-blur-xl px-4 py-4 space-y-2 animate-fadeIn shadow-2xl">
          <button
            onClick={() => handleNavClick('form')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              currentView === 'form'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5" />
              <span>Formulir Pendaftaran PMB</span>
            </div>
            <span className="text-xs opacity-75">Reguler & Karyawan</span>
          </button>

          <button
            onClick={() => handleNavClick('info')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              currentView === 'info'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5" />
              <span>Tentang STARS YKPN</span>
            </div>
            <span className="text-xs opacity-75">Biaya & Profil</span>
          </button>

          <div className="pt-2 border-t border-slate-800">
            {adminUser ? (
              <div className="space-y-2">
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    currentView === 'admin'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-emerald-400" />
                    <span>Portal Administrator</span>
                  </div>
                  <span className="text-xs bg-emerald-800/60 px-2 py-0.5 rounded text-emerald-200">Aktif</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 border border-rose-900/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar dari Akun Admin</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('admin')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  currentView === 'admin'
                    ? 'bg-slate-800 text-amber-400 border border-amber-500/40'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>Portal Administrator</span>
                </div>
                <span className="text-xs text-slate-400">Petugas PMB</span>
              </button>
            )}
          </div>

          {/* Quick Help Contacts on Mobile Menu */}
          <div className="pt-3 border-t border-slate-800">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              WhatsApp Panitia PMB:
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {KONTAK_PANITIA_PMB.map((panitia, idx) => (
                <a
                  key={idx}
                  href={`${panitia.waLink}?text=Halo%20Bapak%20${encodeURIComponent(panitia.nama)},%20saya%20ingin%20konsultasi%20PMB%20STARS%20YKPN.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-800/80 hover:bg-emerald-900/40 border border-slate-700/60 text-center transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400 mb-1" />
                  <span className="text-[11px] font-bold text-white truncate max-w-full">
                    {panitia.nama.split(' ')[0]}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
