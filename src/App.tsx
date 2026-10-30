/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PublicForm } from './components/PublicForm';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { AboutCampus } from './components/AboutCampus';
import { Registration, AdminUser, RegistrationStatus, RegistrationFormData } from './types';
import { 
  getStoredRegistrations, 
  getAdminSession, 
  setAdminSession, 
  clearAdminSession, 
  deleteRegistration, 
  updateRegistrationStatus, 
  addRegistration, 
  resetToSampleData 
} from './utils/storage';
import { 
  fetchAllRegistrations, 
  createRegistrationCloud, 
  updateRegistrationStatusCloud, 
  deleteRegistrationCloud, 
  subscribeToLiveRegistrations, 
  testFirestoreConnection 
} from './utils/firestoreService';
import { Building2, Heart, ShieldCheck, Phone, Mail, MapPin, Cloud, CheckCircle } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'form' | 'admin' | 'info'>('form');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleRefreshCloud = async () => {
    setIsSyncing(true);
    try {
      const items = await fetchAllRegistrations();
      if (items) {
        setRegistrations(items);
        setIsCloudConnected(true);
      }
    } catch (err) {
      console.warn('Manual cloud sync notice:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Initialize data on mount and connect to Cloud Firestore
  useEffect(() => {
    // 1. Load local cache first for instant UI response
    const stored = getStoredRegistrations();
    setRegistrations(stored);

    const session = getAdminSession();
    if (session) {
      setAdminUser(session);
    }
    setIsInitialized(true);

    // 2. Test Firestore connection & fetch Cloud data
    testFirestoreConnection().then(connected => {
      setIsCloudConnected(connected);
    });

    fetchAllRegistrations().then(cloudItems => {
      if (cloudItems && cloudItems.length > 0) {
        setRegistrations(cloudItems);
      }
    });

    // 3. Real-time live listener from Cloud Firestore across all devices
    const unsubscribe = subscribeToLiveRegistrations(
      (liveData) => {
        setIsCloudConnected(true);
        if (liveData) {
          setRegistrations(liveData);
        }
      },
      () => {
        setIsCloudConnected(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleNavigate = (view: 'form' | 'admin' | 'info') => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    setAdminSession(user, false);
    setCurrentView('admin');
  };

  const handleLogout = () => {
    clearAdminSession();
    setAdminUser(null);
    setCurrentView('form');
  };

  const handleFormSubmitSuccess = (newReg: Registration) => {
    setRegistrations(prev => {
      if (prev.some(r => r.id === newReg.id)) return prev;
      return [newReg, ...prev];
    });
  };

  const handleUpdateStatus = (id: string, status: RegistrationStatus, notes?: string) => {
    const updated = updateRegistrationStatus(id, status, notes);
    setRegistrations(updated);
    updateRegistrationStatusCloud(id, status, notes);
  };

  const handleDeleteRegistration = (id: string) => {
    const updated = deleteRegistration(id);
    setRegistrations(updated);
    deleteRegistrationCloud(id);
  };

  const handleAddManualRegistration = async (formData: RegistrationFormData) => {
    const newRecord = await createRegistrationCloud(formData);
    setRegistrations(prev => [newRecord, ...prev]);
  };

  const handleResetSampleData = () => {
    if (window.confirm('Reset data pendaftar ke data awal contoh?')) {
      const reset = resetToSampleData();
      setRegistrations(reset);
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 p-2 rounded-2xl bg-white/10 ring-2 ring-amber-400/40">
            <img
              src="/assets/aistudio/image_84723e49.png"
              alt="Logo STARS YKPN"
              className="w-full h-full object-contain animate-pulse"
            />
          </div>
          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-300">Memuat Sistem PMB STARS YKPN...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        adminUser={adminUser}
        onLogout={handleLogout}
        isCloudConnected={isCloudConnected}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'form' && (
          <PublicForm onSubmitSuccess={handleFormSubmitSuccess} />
        )}

        {currentView === 'info' && (
          <AboutCampus onBackToForm={() => handleNavigate('form')} />
        )}

        {currentView === 'admin' && (
          adminUser ? (
            <AdminDashboard
              registrations={registrations}
              onUpdateStatus={handleUpdateStatus}
              onDeleteRegistration={handleDeleteRegistration}
              onAddManualRegistration={handleAddManualRegistration}
              onResetSampleData={handleResetSampleData}
              onRefreshCloud={handleRefreshCloud}
              isSyncing={isSyncing}
            />
          ) : (
            <AdminLogin
              onLoginSuccess={handleLoginSuccess}
              onBackToForm={() => handleNavigate('form')}
            />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 p-1 flex items-center justify-center border border-amber-500/40 ring-1 ring-amber-400/20 overflow-hidden">
                  <img
                    src="/assets/aistudio/image_84723e49.png"
                    alt="Logo STARS YKPN"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-extrabold text-white text-base">STARS YKPN Yogyakarta</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-xs">
                Sekolah Tinggi Arsitektur YKPN Yogyakarta adalah institusi pendidikan tinggi arsitektur terkemuka dengan program studi Sarjana (S1) Arsitektur untuk Kelas Reguler dan Kelas Karyawan.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-3">Panitia PMB STARS YKPN</h4>
              <p className="text-slate-400 leading-relaxed mb-2 text-xs">
                Jl. Gagak Rimang No. 2-4, Balapan, Klitren, Gondokusuman, Yogyakarta 55222
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300 mb-3">
                <li className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-400">•</span>
                  <strong>Aulia Abrar:</strong> 
                  <a href="https://wa.me/6281262361981" target="_blank" rel="noopener noreferrer" className="font-mono text-amber-300 hover:underline inline-flex items-center gap-1">
                    081262361981
                  </a>
                </li>
                <li className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-400">•</span>
                  <strong>Adibowo:</strong> 
                  <a href="https://wa.me/628122777205" target="_blank" rel="noopener noreferrer" className="font-mono text-amber-300 hover:underline inline-flex items-center gap-1">
                    08122777205
                  </a>
                </li>
                <li className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-400">•</span>
                  <strong>Ardiansyah:</strong> 
                  <a href="https://wa.me/6285729635018" target="_blank" rel="noopener noreferrer" className="font-mono text-amber-300 hover:underline inline-flex items-center gap-1">
                    085729635018
                  </a>
                </li>
              </ul>
              <p className="text-slate-400 text-xs flex items-center gap-1.5 flex-wrap">
                <span>Email Resmi:</span>
                <a href="mailto:starsykpn@gmail.com" className="text-amber-300 hover:underline font-medium">
                  starsykpn@gmail.com
                </a>
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-3">Akses & Informasi</h4>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => handleNavigate('form')}
                    className="hover:text-amber-400 transition-colors text-left py-0.5"
                  >
                    Formulir Pendaftaran PMB (Reguler & Karyawan)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('info')}
                    className="hover:text-amber-400 transition-colors text-left py-0.5"
                  >
                    Profil Kampus & Fasilitas Studio
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('admin')}
                    className="inline-flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors text-left py-0.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Portal Administrator (Khusus Petugas PMB)</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p>
              &copy; {new Date().getFullYear()} Sekolah Tinggi Arsitektur YKPN (STARS YKPN) Yogyakarta. Hak Cipta Dilindungi.
            </p>
            <p className="flex items-center gap-1">
              <span>Sistem Penerimaan Mahasiswa Baru</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
