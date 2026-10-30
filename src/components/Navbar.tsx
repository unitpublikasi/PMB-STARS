import React from 'react';
import { Building2, ShieldCheck, LogOut, FileText, UserCheck, PhoneCall, Info } from 'lucide-react';
import { AdminUser } from '../types';

interface NavbarProps {
  currentView: 'form' | 'admin' | 'info';
  onNavigate: (view: 'form' | 'admin' | 'info') => void;
  adminUser: AdminUser | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  adminUser,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white transition-all shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Campus Identity */}
          <button
            onClick={() => onNavigate('form')}
            className="flex items-center gap-3.5 text-left group focus:outline-none"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 p-1 flex items-center justify-center shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-transform duration-200 ring-2 ring-amber-400/40 overflow-hidden">
              <img
                src="/assets/aistudio/image_84723e49.png"
                alt="Logo STARS YKPN"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-xl text-white group-hover:text-amber-400 transition-colors">
                  STARS YKPN
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  YOGYAKARTA
                </span>
              </div>
              <p className="text-xs text-slate-300 hidden sm:block font-medium">
                Sekolah Tinggi Arsitektur YKPN • Penerimaan Mahasiswa Baru
              </p>
            </div>
          </button>

          {/* Navigation Items */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => onNavigate('form')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'form'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Formulir PMB</span>
            </button>

            <button
              onClick={() => onNavigate('info')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'info'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Info className="w-4 h-4" />
              <span className="hidden md:inline">Tentang STARS YKPN</span>
              <span className="md:hidden">Info</span>
            </button>

            {/* Admin button / status */}
            {adminUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
                <button
                  onClick={() => onNavigate('admin')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentView === 'admin'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900/60'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-emerald-300" />
                  <span className="hidden sm:inline">Admin Panel</span>
                </button>
                <button
                  onClick={onLogout}
                  title="Keluar dari Admin"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('admin')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'admin'
                    ? 'bg-slate-800 text-amber-400 border border-amber-500/40 shadow-inner'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Portal Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
