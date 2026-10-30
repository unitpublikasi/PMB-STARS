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
import { Building2, Heart, ShieldCheck, Phone, Mail, MapPin, Cloud, CloudCheck } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'form' | 'admin' | 'info'>('form');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCloudConnected, setIsCloudConnected] = useState(false);

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

    // 3. Real-time live listener from Cloud Firestore
    const unsubscribe = subscribeToLiveRegistrations(
      (liveData) => {
        setIsCloudConnected(true);
        if (liveData && liveData.length > 0) {
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
              <h4 className="text-white font-bold text-sm mb-3">Kampus & Lokasi</h4>
              <p className="text-slate-400 leading-relaxed mb-2">
                Jl. Gagak Rimang No. 2-4, Balapan, Klitren, Kec. Gondokusuman, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55222
              </p>
              <p className="text-slate-400">
                Email: <span className="text-slate-200">pmb@starsykpn.ac.id</span>
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-3">Akses & Informasi</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleNavigate('form')}
                    className="hover:text-amber-400 transition-colors"
                  >
                    Formulir Pendaftaran PMB (Reguler & Karyawan)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('info')}
                    className="hover:text-amber-400 transition-colors"
                  >
                    Profil Kampus & Fasilitas Studio
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('admin')}
                    className="inline-flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
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
