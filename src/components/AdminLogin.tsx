import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { AdminUser } from '../types';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToForm: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToForm,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Mohon masukkan Username dan Password Admin.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Validate credentials: User: admin, Pass: admin4321 (credentials kept hidden)
      if (username.trim() === 'admin' && password === 'admin4321') {
        const user: AdminUser = {
          username: 'admin',
          role: 'Administrator PMB',
          loggedInAt: new Date().toISOString(),
        };
        onLoginSuccess(user);
      } else {
        setIsLoading(false);
        setError('Username atau Password yang Anda masukkan salah. Akses ditolak.');
      }
    }, 500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header with Navy background */}
        <div className="bg-slate-900 px-8 py-8 text-center text-white relative">
          <button
            type="button"
            onClick={onBackToForm}
            className="absolute top-5 left-5 text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-slate-800/90 p-1.5 border border-amber-500/40 flex items-center justify-center mx-auto mb-3 shadow-lg ring-2 ring-amber-400/20 overflow-hidden">
            <img
              src="/assets/aistudio/image_84723e49.png"
              alt="Logo STARS YKPN"
              className="w-full h-full object-contain"
            />
          </div>

          <h2 className="text-xl font-extrabold tracking-tight">Portal Khusus Admin</h2>
          <p className="text-xs text-slate-300 mt-1">
            Sekolah Tinggi Arsitektur YKPN (STARS YKPN) Yogyakarta
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                autoComplete="username"
                placeholder="Masukkan username admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all bg-slate-50/50 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-sm shadow-md transition-all hover:shadow-lg disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi Akses...</span>
                </>
              ) : (
                <span>Masuk ke Panel Admin</span>
              )}
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onBackToForm}
              className="text-xs text-slate-500 hover:text-slate-800 underline transition-colors"
            >
              Kembali ke Formulir Pendaftaran Mahasiswa Baru
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
