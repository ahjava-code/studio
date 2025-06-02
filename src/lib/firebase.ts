
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA5aSu1oO0CktpD5PZRJsdxPVZPBN5VaIs",
  authDomain: "type-duel-aa476.firebaseapp.com",
  projectId: "type-duel-aa476",
  storageBucket: "type-duel-aa476.firebasestorage.app",
  messagingSenderId: "384362073549",
  appId: "1:384362073549:web:f763dd38689cbe35b6c884",
  measurementId: "G-GS1HWGMF2Z"
};

if (!firebaseConfig.apiKey) {
  console.error(
    'Firebase API Key is missing. ' +
    'Please ensure NEXT_PUBLIC_FIREBASE_API_KEY is correctly set in your .env.local file ' +
    'and that you have restarted the Next.js development server.'
  );
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
