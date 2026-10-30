import { Registration, RegistrationFormData, AdminUser } from '../types';
import { INITIAL_REGISTRATIONS } from '../data/initialData';

const STORAGE_KEY_REGISTRATIONS = 'pmb_stars_ykpn_registrations_v1';
const STORAGE_KEY_ADMIN_SESSION = 'pmb_stars_ykpn_admin_session_v1';

export function getStoredRegistrations(): Registration[] {
  if (typeof window === 'undefined') return INITIAL_REGISTRATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REGISTRATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify(INITIAL_REGISTRATIONS));
      return INITIAL_REGISTRATIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_REGISTRATIONS;
  } catch (err) {
    console.error('Failed to read registrations from localStorage:', err);
    return INITIAL_REGISTRATIONS;
  }
}

export function saveRegistrations(items: Registration[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save registrations to localStorage:', err);
  }
}

export function addRegistration(formData: RegistrationFormData): Registration {
  const current = getStoredRegistrations();
  const nextNum = current.length + 1;
  const padNum = String(nextNum).padStart(3, '0');
  const year = new Date().getFullYear();
  const id = `REG-YKPN-${year}-${padNum}`;

  const newRecord: Registration = {
    ...formData,
    id,
    status: 'baru',
    createdAt: new Date().toISOString(),
  };

  const updated = [newRecord, ...current];
  saveRegistrations(updated);
  return newRecord;
}

export function deleteRegistration(id: string): Registration[] {
  const current = getStoredRegistrations();
  const updated = current.filter(item => item.id !== id);
  saveRegistrations(updated);
  return updated;
}

export function updateRegistrationStatus(id: string, status: Registration['status'], catatanAdmin?: string): Registration[] {
  const current = getStoredRegistrations();
  const updated = current.map(item => {
    if (item.id === id) {
      return {
        ...item,
        status,
        ...(catatanAdmin !== undefined ? { catatanAdmin } : {})
      };
    }
    return item;
  });
  saveRegistrations(updated);
  return updated;
}

export function resetToSampleData(): Registration[] {
  saveRegistrations(INITIAL_REGISTRATIONS);
  return INITIAL_REGISTRATIONS;
}

// Admin Session helpers
export function getAdminSession(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_ADMIN_SESSION) || localStorage.getItem(STORAGE_KEY_ADMIN_SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAdminSession(user: AdminUser, persist: boolean = false): void {
  if (typeof window === 'undefined') return;
  const data = JSON.stringify(user);
  if (persist) {
    localStorage.setItem(STORAGE_KEY_ADMIN_SESSION, data);
  } else {
    sessionStorage.setItem(STORAGE_KEY_ADMIN_SESSION, data);
  }
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY_ADMIN_SESSION);
  localStorage.removeItem(STORAGE_KEY_ADMIN_SESSION);
}
