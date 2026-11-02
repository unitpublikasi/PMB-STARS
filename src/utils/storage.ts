import { Registration, RegistrationFormData, AdminUser } from '../types';
import { INITIAL_REGISTRATIONS } from '../data/initialData';

const STORAGE_KEY_REGISTRATIONS = 'pmb_stars_ykpn_registrations_v2';
const STORAGE_KEY_ADMIN_SESSION = 'pmb_stars_ykpn_admin_session_v1';
const STORAGE_KEY_DELETED_IDS = 'pmb_stars_ykpn_deleted_ids_v1';
const STORAGE_KEY_INITIALIZED = 'pmb_stars_ykpn_initialized_v2';

export function getDeletedRegistrationIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DELETED_IDS);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

export function markRegistrationAsDeleted(id: string): void {
  if (typeof window === 'undefined' || !id) return;
  try {
    const current = getDeletedRegistrationIds();
    current.add(id);
    localStorage.setItem(STORAGE_KEY_DELETED_IDS, JSON.stringify(Array.from(current)));
  } catch (err) {
    console.error('Failed to save deleted ID:', err);
  }
}

export function clearDeletedRegistrationIds(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_DELETED_IDS);
  } catch {
    // Ignore
  }
}

export function getStoredRegistrations(): Registration[] {
  if (typeof window === 'undefined') return INITIAL_REGISTRATIONS;
  try {
    const isInitialized = localStorage.getItem(STORAGE_KEY_INITIALIZED) === 'true';
    const raw = localStorage.getItem(STORAGE_KEY_REGISTRATIONS);
    const deletedIds = getDeletedRegistrationIds();

    if (!raw) {
      if (!isInitialized) {
        // First ever visit: seed initial sample registrations
        const seeded = INITIAL_REGISTRATIONS.filter(item => !deletedIds.has(item.id));
        localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify(seeded));
        localStorage.setItem(STORAGE_KEY_INITIALIZED, 'true');
        return seeded;
      }
      // If already initialized and raw is missing or empty, return empty array (do NOT resurrect)
      return [];
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Filter out deleted items
      return parsed.filter(item => item && item.id && !deletedIds.has(item.id));
    }

    return [];
  } catch (err) {
    console.error('Failed to read registrations from localStorage:', err);
    return [];
  }
}

export function saveRegistrations(items: Registration[]): void {
  if (typeof window === 'undefined') return;
  try {
    const deletedIds = getDeletedRegistrationIds();
    const filtered = items.filter(item => item && item.id && !deletedIds.has(item.id));
    localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify(filtered));
    localStorage.setItem(STORAGE_KEY_INITIALIZED, 'true');
  } catch (err) {
    console.error('Failed to save registrations to localStorage:', err);
  }
}

export function addRegistration(formData: RegistrationFormData): Registration {
  const current = getStoredRegistrations();
  const nextNum = current.length + 1;
  const padNum = String(nextNum).padStart(3, '0');
  const year = '2027';
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
  markRegistrationAsDeleted(id);
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
  clearDeletedRegistrationIds();
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
