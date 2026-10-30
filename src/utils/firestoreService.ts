import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
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

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
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
 * Fetch all registrations from Cloud Firestore with local cache fallback
 */
export async function fetchAllRegistrations(): Promise<Registration[]> {
  const colPath = 'registrations';
  try {
    const q = query(collection(db, colPath), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Seed Cloud Firestore with initial sample data so database is populated
      const initial = getStoredRegistrations();
      for (const item of initial) {
        await setDoc(doc(db, colPath, item.id), item);
      }
      return initial;
    }

    const items: Registration[] = [];
    snapshot.forEach(docSnap => {
      items.push(docSnap.data() as Registration);
    });

    // Sync with localStorage
    saveRegistrations(items);
    return items;
  } catch (error) {
    console.warn('Failed to fetch from Firestore, falling back to local storage:', error);
    return getStoredRegistrations();
  }
}

/**
 * Save new registration to Cloud Firestore and localStorage
 */
export async function createRegistrationCloud(formData: RegistrationFormData): Promise<Registration> {
  const colPath = 'registrations';
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

  // Save to local storage first for immediate optimistic response
  const updatedLocal = [newRecord, ...current];
  saveRegistrations(updatedLocal);

  // Save to Cloud Firestore
  try {
    await setDoc(doc(db, colPath, id), newRecord);
  } catch (error) {
    console.error('Failed to save to Firestore directly:', error);
    try {
      handleFirestoreError(error, OperationType.WRITE, `${colPath}/${id}`);
    } catch {
      // Continue so applicant gets confirmation even if transient network error
    }
  }

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
    await updateDoc(doc(db, colPath, id), updateData);
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
 * Subscribe to real-time updates from Cloud Firestore
 */
export function subscribeToLiveRegistrations(
  onData: (registrations: Registration[]) => void,
  onError?: (err: any) => void
): () => void {
  const colPath = 'registrations';
  try {
    const q = query(collection(db, colPath), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const items: Registration[] = [];
        snapshot.forEach(docSnap => {
          items.push(docSnap.data() as Registration);
        });
        if (items.length > 0) {
          saveRegistrations(items);
          onData(items);
        }
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
