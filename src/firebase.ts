import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore using databaseId from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export default app;
