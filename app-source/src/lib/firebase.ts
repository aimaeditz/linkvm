import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;
const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;

const missingVars: string[] = [];
if (!apiKey) missingVars.push('VITE_FIREBASE_API_KEY');
if (!authDomain) missingVars.push('VITE_FIREBASE_AUTH_DOMAIN');
if (!projectId) missingVars.push('VITE_FIREBASE_PROJECT_ID');
if (!storageBucket) missingVars.push('VITE_FIREBASE_STORAGE_BUCKET');
if (!messagingSenderId) missingVars.push('VITE_FIREBASE_MESSAGING_SENDER_ID');
if (!appId) missingVars.push('VITE_FIREBASE_APP_ID');

export const missingFirebaseVars = missingVars;
export const isFirebaseConfigured = missingVars.length === 0;
export const firebaseMissingError =
  missingVars.length > 0
    ? `Firebase is not configured. Missing required environment variables: ${missingVars.join(', ')}. Please configure these in your environment (Vercel / .env).`
    : null;

if (!isFirebaseConfigured) {
  console.warn(
    `[Firebase Notice] ${firebaseMissingError}\nSilently falling back to demo/local mode is disabled. Real Firebase configuration is required.`
  );
}

// Config strictly populated from real environment variables
const firebaseConfig = {
  apiKey: apiKey || 'unconfigured-api-key',
  authDomain: authDomain || 'unconfigured-auth-domain',
  projectId: projectId || 'unconfigured-project-id',
  storageBucket: storageBucket || 'unconfigured-storage-bucket',
  messagingSenderId: messagingSenderId || 'unconfigured-sender-id',
  appId: appId || 'unconfigured-app-id',
  measurementId: measurementId || undefined,
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Set browser local persistence so real Firebase auth survives page reloads
if (isFirebaseConfigured) {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn('Failed to set auth persistence:', err);
  });
}

// Google Auth Provider setup with prompt: 'select_account'
// This ensures Chrome always displays the account chooser instead of auto-signing in
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

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
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): FirestoreErrorInfo {
  const message = error instanceof Error ? error.message : String(error);
  const code = (error as { code?: string })?.code || '';

  const errInfo: FirestoreErrorInfo = {
    error: message,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };

  if (code === 'unavailable' || message.includes('unavailable') || message.includes('Could not reach Cloud Firestore')) {
    console.warn('[Firestore Offline Notice] Client is operating in offline mode or backend is unreachable.', path ? `Path: ${path}` : '');
  } else {
    console.warn('Database Warning: ', JSON.stringify(errInfo));
  }

  return errInfo;
}

export async function testConnection(): Promise<boolean> {
  if (!isFirebaseConfigured) return false;
  return true;
}

