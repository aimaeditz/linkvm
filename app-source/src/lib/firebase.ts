import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

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

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}. Please check your .env configuration.`
  );
}

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId: measurementId || undefined,
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Set browser local persistence so authentication state survives page reloads
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error('Failed to set auth persistence:', err);
});

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
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
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
  console.warn('Database Warning: ', JSON.stringify(errInfo));
  return errInfo;
}

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.warn('Database connection offline.');
    }
  }
}

testConnection();
