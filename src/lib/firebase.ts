import { initializeApp, getApps } from 'firebase/app';
import { Firestore, getFirestore, initializeFirestore } from 'firebase/firestore';

// Firebase web config is public by design (it ships in every page).
// Access is controlled by firestore.rules, not by hiding these values.
// Environment variables override the defaults if you point at another project.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBNnayrM81z7IVug2dYsyLUvYdd9SxQxxs',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'queless-54892.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'queless-54892',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'queless-54892.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '678814452376',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:678814452376:web:536f5db583c8cafb051eed',
};

/** True when real Firebase keys are set. Without them the app runs in local (single-browser) mode. */
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let db: Firestore | null = null;

export function getDb(): Firestore {
  if (!isFirebaseConfigured) throw new Error('Firebase is not configured');
  if (!db) {
    const app = getApps()[0] ?? initializeApp(firebaseConfig);
    try {
      db = initializeFirestore(app, { ignoreUndefinedProperties: true });
    } catch {
      db = getFirestore(app); // already initialized (hot reload)
    }
  }
  return db;
}
