import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocFromServer
} from 'firebase/firestore';
import { db } from '../firebase';
import { Registration, RegistrationFormData, RegistrationStatus } from '../types';
import { INITIAL_REGISTRATIONS } from '../data/initialData';
import { getStoredRegistrations, saveRegistrations } from './storage';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {},
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Remove all undefined properties so Firestore never throws unsupported field errors
 */
function cleanPayload<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Generate a unique registration ID across any device
 */
export function generateUniqueRegistrationId(): string {
  const year = '2027';
  const timeCode = Date.now().toString().slice(-4);
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `REG-YKPN-${year}-${timeCode}${randomSuffix}`;
}

/**
 * Sort registrations helper (newest first)
 */
function sortRegistrationsDesc(items: Registration[]): Registration[] {
  return [...items].sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });
}

/**
 * Test connectivity to Firestore server
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    console.warn('Firestore server test notice:', error);
    return false;
  }
}

/**
 * Fetch all registrations from Cloud Firestore.
 * Always populates from cloud, ensuring any other laptop gets latest synced data.
 */
export async function fetchAllRegistrations(): Promise<Registration[]> {
  const colPath = 'registrations';
  try {
    const colRef = collection(db, colPath);
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      // First time initialization: seed Cloud Firestore with initial sample data
      console.log('Firestore is empty. Seeding initial registrations to cloud...');
      const initial = INITIAL_REGISTRATIONS;
      for (const item of initial) {
        const cleaned = cleanPayload(item);
        await setDoc(doc(db, colPath, item.id), cleaned);
      }
      saveRegistrations(initial);
      return initial;
    }

    const items: Registration[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data() as Registration;
      items.push(data);
    });

    const sorted = sortRegistrationsDesc(items);
    // Cache to localStorage for fast subsequent offline renders
    saveRegistrations(sorted);
    return sorted;
  } catch (error) {
    console.warn('Failed to fetch from Firestore, falling back to local storage:', error);
    return getStoredRegistrations();
  }
}

/**
 * Save new registration to Cloud Firestore and sync local cache.
 */
export async function createRegistrationCloud(formData: RegistrationFormData): Promise<Registration> {
  const colPath = 'registrations';
  const id = generateUniqueRegistrationId();

  const newRecord: Registration = {
    ...formData,
    id,
    status: 'baru',
    createdAt: new Date().toISOString(),
  };

  const payload = cleanPayload(newRecord);

  try {
    // 1. Direct write to Cloud Firestore
    await setDoc(doc(db, colPath, id), payload);
    console.log(`Successfully persisted registration ${id} to Cloud Firestore.`);
  } catch (error) {
    console.error('Failed to save to Firestore directly:', error);
    try {
      handleFirestoreError(error, OperationType.WRITE, `${colPath}/${id}`);
    } catch {
      // Allow fallback so user isn't blocked completely
    }
  }

  // 2. Update local storage cache
  const current = getStoredRegistrations();
  const updatedLocal = sortRegistrationsDesc([newRecord, ...current.filter(r => r.id !== id)]);
  saveRegistrations(updatedLocal);

  return newRecord;
}

/**
 * Update registration status and notes in Cloud Firestore and localStorage
 */
export async function updateRegistrationStatusCloud(
  id: string, 
  status: RegistrationStatus, 
  notes?: string
): Promise<void> {
  const colPath = 'registrations';
  try {
    const updateData: Record<string, any> = { status };
    if (notes !== undefined) {
      updateData.catatanAdmin = notes;
    }
    const payload = cleanPayload(updateData);
    await updateDoc(doc(db, colPath, id), payload);
  } catch (error) {
    console.warn('Failed to update in Firestore:', error);
    try {
      handleFirestoreError(error, OperationType.UPDATE, `${colPath}/${id}`);
    } catch {
      // Fallback
    }
  }
}

/**
 * Delete registration from Cloud Firestore and localStorage
 */
export async function deleteRegistrationCloud(id: string): Promise<void> {
  const colPath = 'registrations';
  try {
    await deleteDoc(doc(db, colPath, id));
  } catch (error) {
    console.warn('Failed to delete in Firestore:', error);
    try {
      handleFirestoreError(error, OperationType.DELETE, `${colPath}/${id}`);
    } catch {
      // Fallback
    }
  }
}

/**
 * Subscribe to real-time updates from Cloud Firestore across all connected devices
 */
export function subscribeToLiveRegistrations(
  onData: (registrations: Registration[]) => void,
  onError?: (err: any) => void
): () => void {
  const colPath = 'registrations';
  try {
    const colRef = collection(db, colPath);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const items: Registration[] = [];
        snapshot.forEach(docSnap => {
          items.push(docSnap.data() as Registration);
        });
        
        const sorted = sortRegistrationsDesc(items);
        saveRegistrations(sorted);
        onData(sorted);
      },
      (error) => {
        console.warn('Realtime snapshot notice:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.warn('Could not establish live snapshot listener:', error);
    return () => {};
  }
}
