import {
  User,
  LinkItem,
  ThemeConfig,
  SocialLinks,
  AnalyticsEvent,
  AnalyticsSummary,
} from '../types';
import { slugify } from './utils';
import { THEME_PRESETS, presetToConfig } from './themes';
import { validateUsername } from './reserved-usernames';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
  isFirebaseConfigured,
  firebaseMissingError,
} from './firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  deleteUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  writeBatch,
  runTransaction,
} from 'firebase/firestore';

function assertFirebaseConfigured(): void {
  if (!isFirebaseConfigured) {
    const errorMsg =
      firebaseMissingError ||
      'Firebase is not configured. Missing required environment variables: VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGING_SENDER_ID, VITE_FIREBASE_APP_ID.';
    console.error(`[Firebase Configuration Error] ${errorMsg}`);
    throw new Error(errorMsg);
  }
}

// In-memory application state
let cachedCurrentUser: User | null = null;
let cachedLinks: LinkItem[] = [];
let cachedTheme: ThemeConfig | null = null;
let cachedSocials: SocialLinks | null = null;
let cachedAnalytics: AnalyticsEvent[] = [];

type StateChangeListener = () => void;
const listeners: Set<StateChangeListener> = new Set();

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
type SaveStatusListener = (status: SaveStatus) => void;
const saveStatusListeners: Set<SaveStatusListener> = new Set();
let currentSaveStatus: SaveStatus = 'saved';
let saveStatusTimer: ReturnType<typeof setTimeout> | null = null;

export function subscribeSaveStatus(listener: SaveStatusListener): () => void {
  saveStatusListeners.add(listener);
  listener(currentSaveStatus);
  return () => {
    saveStatusListeners.delete(listener);
  };
}

export function notifySaveStatus(status: SaveStatus) {
  currentSaveStatus = status;
  saveStatusListeners.forEach((l) => l(status));
  if (status === 'saved') {
    if (saveStatusTimer) clearTimeout(saveStatusTimer);
    saveStatusTimer = setTimeout(() => {
      currentSaveStatus = 'idle';
      saveStatusListeners.forEach((l) => l('idle'));
    }, 2500);
  }
}

export function subscribeToStore(listener: StateChangeListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners() {
  listeners.forEach((l) => l());
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

// Auth Ready tracking
let _authReady = false;
let _authReadyResolve: (() => void) | null = null;
export const authReadyPromise = new Promise<void>((resolve) => {
  if (_authReady) {
    resolve();
  } else {
    _authReadyResolve = resolve;
  }
});

export function isAuthReady(): boolean {
  return _authReady;
}

function markAuthReady() {
  _authReady = true;
  if (_authReadyResolve) {
    _authReadyResolve();
    _authReadyResolve = null;
  }
}

function clearLocalCache() {
  cachedCurrentUser = null;
  cachedLinks = [];
  cachedTheme = null;
  cachedSocials = null;
  cachedAnalytics = [];
}

// Global Firebase Auth State Listener
if (isFirebaseConfigured) {
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        await syncUserFromFirebase(firebaseUser);
      } catch (err) {
        console.error('Error syncing user on auth state change:', err);
      }
    } else {
      clearLocalCache();
      notifyListeners();
    }
    markAuthReady();
  });
} else {
  // If not configured, mark auth ready immediately so app displays configuration error
  markAuthReady();
}

export async function checkUsernameAvailableInFirestore(rawUsername: string): Promise<boolean> {
  const clean = slugify(rawUsername).toLowerCase().replace(/[^a-z0-9_-]/g, '');
  if (!clean || clean.length < 3 || clean.length > 30) return false;
  const val = validateUsername(clean);
  if (!val.valid) return false;

  assertFirebaseConfigured();
  try {
    const unameDocRef = doc(db, 'usernames', clean);
    const snap = await getDoc(unameDocRef);
    if (snap.exists()) {
      const data = snap.data();
      const currentUid = auth.currentUser?.uid || cachedCurrentUser?.id;
      if (currentUid && data.uid === currentUid) {
        return true;
      }
      return false;
    }
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `usernames/${clean}`);
    return false;
  }
}

export async function syncUserFromFirebase(firebaseUser: FirebaseUser, fallbackName?: string): Promise<User> {
  assertFirebaseConfigured();
  const uid = firebaseUser.uid;
  const userRef = doc(db, 'users', uid);
  const now = new Date().toISOString();

  let userDocSnap;
  try {
    userDocSnap = await getDoc(userRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${uid}`);
    throw err;
  }

  let userData: User;

  if (userDocSnap.exists()) {
    const existing = userDocSnap.data() as User;
    const nameVal = existing.name || fallbackName || firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Creator');
    userData = {
      ...existing,
      id: uid,
      email: firebaseUser.email || existing.email || '',
      displayName: firebaseUser.displayName || existing.displayName || nameVal,
      photoURL: firebaseUser.photoURL || existing.photoURL || '',
      avatarUrl: existing.avatarUrl || firebaseUser.photoURL || '',
      name: nameVal,
      googleEmail: firebaseUser.email || existing.googleEmail || '',
      googleName: firebaseUser.displayName || existing.googleName || '',
      googlePicture: firebaseUser.photoURL || existing.googlePicture || '',
      googleSub: firebaseUser.uid,
      updatedAt: now,
    };

    try {
      await updateDoc(userRef, {
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        avatarUrl: userData.avatarUrl,
        name: userData.name,
        googleEmail: userData.googleEmail,
        googleName: userData.googleName,
        googlePicture: userData.googlePicture,
        googleSub: userData.googleSub,
        updatedAt: now,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
    }
  } else {
    // Generate unique username for new user
    let chosenUsername = AuthService.generateUniqueUsername(firebaseUser.email || fallbackName || 'creator');
    let isAvail = await checkUsernameAvailableInFirestore(chosenUsername);
    let attempts = 0;
    while (!isAvail && attempts < 10) {
      attempts++;
      chosenUsername = `${AuthService.generateUniqueUsername(firebaseUser.email || 'creator')}${Math.floor(100 + Math.random() * 900)}`;
      isAvail = await checkUsernameAvailableInFirestore(chosenUsername);
    }

    const nameVal = fallbackName || firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Creator');

    userData = {
      id: uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || nameVal,
      name: nameVal,
      photoURL: firebaseUser.photoURL || '',
      avatarUrl: firebaseUser.photoURL || '',
      username: chosenUsername,
      bio: '',
      sharePattern: '{username}',
      invitesSent: 0,
      invitesAccepted: 0,
      referralCode: `${chosenUsername}-${Math.floor(1000 + Math.random() * 9000)}`,
      googleSub: firebaseUser.uid,
      googleEmail: firebaseUser.email || '',
      googleName: firebaseUser.displayName || '',
      googlePicture: firebaseUser.photoURL || '',
      notifications: {
        weeklySummary: true,
        securityAlerts: true,
      },
      privacy: {
        searchIndexing: true,
        anonymousAnalytics: false,
      },
      hasSharedAt: null,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await runTransaction(db, async (transaction) => {
        const unameRef = doc(db, 'usernames', chosenUsername);
        transaction.set(unameRef, { uid, createdAt: now });
        transaction.set(userRef, userData);
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${uid}`);
      throw err;
    }

    // Set initial default theme
    try {
      const initialTheme = presetToConfig(THEME_PRESETS[0], uid);
      await setDoc(doc(db, 'users', uid, 'theme', 'default'), initialTheme);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${uid}/theme/default`);
    }

    // Set initial default socials
    try {
      const initialSocials = { id: 'default', userId: uid };
      await setDoc(doc(db, 'users', uid, 'socials', 'default'), initialSocials);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${uid}/socials/default`);
    }
  }

  cachedCurrentUser = userData;

  // Load user links from real Firestore
  try {
    const linksSnap = await getDocs(collection(db, 'users', uid, 'links'));
    const loadedLinks: LinkItem[] = [];
    linksSnap.forEach((docSnap) => {
      loadedLinks.push(docSnap.data() as LinkItem);
    });
    loadedLinks.sort((a, b) => a.position - b.position);
    cachedLinks = loadedLinks;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, `users/${uid}/links`);
    cachedLinks = [];
  }

  // Load user theme from real Firestore
  try {
    const themeSnap = await getDoc(doc(db, 'users', uid, 'theme', 'default'));
    if (themeSnap.exists()) {
      cachedTheme = themeSnap.data() as ThemeConfig;
    } else {
      cachedTheme = presetToConfig(THEME_PRESETS[0], uid);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${uid}/theme/default`);
    cachedTheme = presetToConfig(THEME_PRESETS[0], uid);
  }

  // Load user socials from real Firestore
  try {
    const socialsSnap = await getDoc(doc(db, 'users', uid, 'socials', 'default'));
    if (socialsSnap.exists()) {
      cachedSocials = socialsSnap.data() as SocialLinks;
    } else {
      cachedSocials = { id: 'default', userId: uid };
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${uid}/socials/default`);
    cachedSocials = { id: 'default', userId: uid };
  }

  // Load analytics from real Firestore
  try {
    const analyticsSnap = await getDocs(collection(db, 'users', uid, 'analytics'));
    const loadedEvents: AnalyticsEvent[] = [];
    analyticsSnap.forEach((docSnap) => {
      loadedEvents.push(docSnap.data() as AnalyticsEvent);
    });
    cachedAnalytics = loadedEvents;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, `users/${uid}/analytics`);
    cachedAnalytics = [];
  }

  notifyListeners();
  return userData;
}

export class AuthService {
  static getSessionUserId(): string | null {
    return auth.currentUser ? auth.currentUser.uid : cachedCurrentUser?.id || null;
  }

  static isSessionActive(): boolean {
    return Boolean(auth.currentUser || cachedCurrentUser);
  }

  static async loginWithEmail(email: string, password: string): Promise<User> {
    assertFirebaseConfigured();
    const trimmedEmail = email.trim();
    const result = await signInWithEmailAndPassword(auth, trimmedEmail, password);
    const user = await syncUserFromFirebase(result.user);
    return user;
  }

  static async signupWithEmail(name: string, email: string, password: string): Promise<User> {
    assertFirebaseConfigured();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    const result = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
    if (trimmedName) {
      try {
        await updateFirebaseProfile(result.user, { displayName: trimmedName });
      } catch {
        // non-blocking
      }
    }
    const user = await syncUserFromFirebase(result.user, trimmedName);
    return user;
  }

  static async sendPasswordReset(email: string): Promise<void> {
    assertFirebaseConfigured();
    await sendPasswordResetEmail(auth, email.trim());
  }

  static async loginWithGoogle(): Promise<{ user?: User; error?: string }> {
    assertFirebaseConfigured();
    googleProvider.setCustomParameters({
      prompt: 'select_account',
    });
    const result = await signInWithPopup(auth, googleProvider);
    const user = await syncUserFromFirebase(result.user);
    return { user };
  }

  static async loginWithGoogleFirebase(): Promise<User> {
    assertFirebaseConfigured();
    googleProvider.setCustomParameters({
      prompt: 'select_account',
    });
    const result = await signInWithPopup(auth, googleProvider);
    const user = await syncUserFromFirebase(result.user);
    return user;
  }

  static async logout(): Promise<void> {
    if (isFirebaseConfigured && auth.currentUser) {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn('Sign-out error:', err);
      }
    }
    clearLocalCache();
    notifyListeners();
  }

  static getCurrentUserSync(): User | null {
    return cachedCurrentUser;
  }

  static async getCurrentUser(): Promise<User | null> {
    if (isFirebaseConfigured && auth.currentUser) {
      if (!cachedCurrentUser || cachedCurrentUser.id !== auth.currentUser.uid) {
        await syncUserFromFirebase(auth.currentUser);
      }
    }
    return cachedCurrentUser;
  }

  static async checkUsernameAvailable(username: string): Promise<boolean> {
    return checkUsernameAvailableInFirestore(username);
  }

  static generateUniqueUsername(emailOrName: string): string {
    const localPart = emailOrName.includes('@') ? emailOrName.split('@')[0] : emailOrName;
    let base = slugify(localPart || 'creator').slice(0, 16);
    if (base.length < 3) base = `creator_${base}`;
    return base;
  }

  static async updateProfile(partial: Partial<User>): Promise<{ user?: User; error?: string }> {
    assertFirebaseConfigured();
    const uid = AuthService.getSessionUserId();
    if (!uid) return { error: 'Unauthorized' };

    const now = new Date().toISOString();

    if (partial.username && cachedCurrentUser && partial.username.toLowerCase() !== cachedCurrentUser.username.toLowerCase()) {
      const cleanUsername = slugify(partial.username).toLowerCase().replace(/[^a-z0-9_-]/g, '');
      const val = validateUsername(cleanUsername);
      if (!val.valid) {
        notifySaveStatus('error');
        return { error: val.error || 'Invalid username.' };
      }

      const isAvail = await checkUsernameAvailableInFirestore(cleanUsername);
      if (!isAvail) {
        notifySaveStatus('error');
        return { error: 'This username is already taken or was previously registered.' };
      }

      notifySaveStatus('saving');
      try {
        await runTransaction(db, async (transaction) => {
          const oldUname = cachedCurrentUser!.username.toLowerCase();
          const oldUnameRef = doc(db, 'usernames', oldUname);
          const newUnameRef = doc(db, 'usernames', cleanUsername);
          const userRef = doc(db, 'users', uid);

          const existingNewSnap = await transaction.get(newUnameRef);
          if (existingNewSnap.exists() && existingNewSnap.data().uid !== uid) {
            throw new Error('This username is already taken or was previously registered.');
          }

          // Retain old username record marked as retired so it cannot be claimed by another user
          transaction.set(oldUnameRef, { uid, retired: true, updatedAt: now }, { merge: true });
          transaction.set(newUnameRef, { uid, createdAt: now, active: true });
          transaction.update(userRef, {
            ...partial,
            username: cleanUsername,
            updatedAt: now,
          });
        });
        notifySaveStatus('saved');
      } catch (err) {
        notifySaveStatus('error');
        handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
        return { error: 'Failed to update username. Please try again.' };
      }

      if (cachedCurrentUser) {
        cachedCurrentUser = {
          ...cachedCurrentUser,
          ...partial,
          username: cleanUsername,
          updatedAt: now,
        };
      }
      notifyListeners();
      return { user: cachedCurrentUser! };
    }

    const updatedUser: User = {
      ...(cachedCurrentUser || {
        id: uid,
        email: '',
        name: 'Creator',
        username: 'user',
        createdAt: now,
        updatedAt: now,
      }),
      ...partial,
      updatedAt: now,
    };

    notifySaveStatus('saving');
    try {
      await setDoc(doc(db, 'users', uid), updatedUser, { merge: true });
      notifySaveStatus('saved');
    } catch (err) {
      notifySaveStatus('error');
      handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
      return { error: 'Failed to save profile changes.' };
    }

    cachedCurrentUser = updatedUser;
    notifyListeners();
    return { user: updatedUser };
  }

  static async deleteAccount(): Promise<void> {
    assertFirebaseConfigured();
    const current = auth.currentUser;
    const uid = current?.uid || cachedCurrentUser?.id;
    if (!uid || !current) {
      throw new Error('Not authenticated');
    }

    notifySaveStatus('saving');
    try {
      const batch = writeBatch(db);

      if (cachedCurrentUser?.username) {
        // Mark username as tombstoned/deleted to preserve history & prevent reuse
        const unameClean = cachedCurrentUser.username.toLowerCase();
        batch.set(
          doc(db, 'usernames', unameClean),
          {
            uid,
            deleted: true,
            deletedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }

      const linksSnap = await getDocs(collection(db, 'users', uid, 'links'));
      linksSnap.forEach((d) => batch.delete(d.ref));

      batch.delete(doc(db, 'users', uid, 'theme', 'default'));
      batch.delete(doc(db, 'users', uid, 'socials', 'default'));

      const analyticsSnap = await getDocs(collection(db, 'users', uid, 'analytics'));
      analyticsSnap.forEach((d) => batch.delete(d.ref));

      batch.delete(doc(db, 'users', uid));

      await batch.commit();

      try {
        await deleteUser(current);
      } catch (authErr) {
        console.warn('Firebase auth deleteUser notice:', authErr);
        await signOut(auth);
      }
      notifySaveStatus('saved');
    } catch (err) {
      notifySaveStatus('error');
      handleFirestoreError(err, OperationType.DELETE, `users/${uid}`);
      throw err;
    }

    clearLocalCache();
    notifyListeners();
  }
}

export class StorageService {
  static isAuthReady(): boolean {
    return isAuthReady();
  }

  static get authReadyPromise(): Promise<void> {
    return authReadyPromise;
  }

  static isSessionActive(): boolean {
    return AuthService.isSessionActive();
  }

  static getSessionUserId(): string | null {
    return AuthService.getSessionUserId();
  }

  static async logout(): Promise<void> {
    await AuthService.logout();
  }

  static getCurrentUser(): User | null {
    return cachedCurrentUser;
  }

  static async findUserByUsernameAsync(username: string): Promise<User | null> {
    const clean = slugify(username);
    if (!clean) return null;

    if (cachedCurrentUser && cachedCurrentUser.username.toLowerCase() === clean) {
      return cachedCurrentUser;
    }

    assertFirebaseConfigured();
    try {
      const unameDocRef = doc(db, 'usernames', clean);
      const unameSnap = await getDoc(unameDocRef);
      if (unameSnap.exists()) {
        const uid = unameSnap.data()?.uid;
        if (uid) {
          const userDocRef = doc(db, 'users', uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            return userSnap.data() as User;
          }
        }
      }

      // Direct fallback lookup by uid/id
      const directUserSnap = await getDoc(doc(db, 'users', clean));
      if (directUserSnap.exists()) {
        return directUserSnap.data() as User;
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `usernames/${clean}`);
    }

    return null;
  }

  static findUserByUsername(username: string): User | null {
    const clean = slugify(username);
    if (cachedCurrentUser && cachedCurrentUser.username.toLowerCase() === clean) {
      return cachedCurrentUser;
    }
    return null;
  }

  static async checkUsernameAvailable(username: string): Promise<{ available: boolean; error?: string }> {
    const avail = await checkUsernameAvailableInFirestore(username);
    return {
      available: avail,
      error: avail ? undefined : 'This username is already taken or reserved.',
    };
  }

  static checkUsernameAvailability(username: string, excludeUserId?: string): boolean {
    const clean = slugify(username);
    if (!clean || clean.length < 3 || clean.length > 30) return false;
    const val = validateUsername(clean);
    if (!val.valid) return false;
    if (cachedCurrentUser && cachedCurrentUser.username.toLowerCase() === clean && cachedCurrentUser.id === excludeUserId) {
      return true;
    }
    return true;
  }

  static async updateUserAsync(partial: Partial<User>): Promise<User | null> {
    const res = await AuthService.updateProfile(partial);
    return res.user || null;
  }

  static updateUser(partial: Partial<User>): User | null {
    AuthService.updateProfile(partial);
    if (cachedCurrentUser) {
      cachedCurrentUser = { ...cachedCurrentUser, ...partial, updatedAt: new Date().toISOString() };
      notifyListeners();
    }
    return cachedCurrentUser;
  }

  // --- Links Operations ---
  static getLinks(): LinkItem[] {
    return cachedLinks;
  }

  static getLinksSync(userId?: string): LinkItem[] {
    if (!userId || userId === cachedCurrentUser?.id) {
      return cachedLinks;
    }
    return [];
  }

  static async getLinksForUserAsync(userId: string): Promise<LinkItem[]> {
    if (cachedCurrentUser && cachedCurrentUser.id === userId) {
      return cachedLinks.filter((l) => l.visible).sort((a, b) => a.position - b.position);
    }
    assertFirebaseConfigured();
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'links'));
      const links: LinkItem[] = [];
      snap.forEach((d) => links.push(d.data() as LinkItem));
      return links.filter((l) => l.visible).sort((a, b) => a.position - b.position);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, `users/${userId}/links`);
    }
    return [];
  }

  static getLinksForUser(userId: string): LinkItem[] {
    if (userId === cachedCurrentUser?.id) {
      return cachedLinks.filter((l) => l.visible);
    }
    return [];
  }

  static async addLinkAsync(
    link: Omit<LinkItem, 'id' | 'userId' | 'clicks' | 'position' | 'createdAt' | 'updatedAt'>
  ): Promise<{ link?: LinkItem; error?: string }> {
    assertFirebaseConfigured();
    const uid = AuthService.getSessionUserId();
    if (!uid) return { error: 'Not authenticated' };

    const newId = generateId();
    const now = new Date().toISOString();
    const newLink: LinkItem = {
      ...link,
      id: newId,
      userId: uid,
      position: cachedLinks.length,
      clicks: 0,
      createdAt: now,
      updatedAt: now,
    };

    cachedLinks = [...cachedLinks, newLink];
    notifyListeners();
    notifySaveStatus('saving');

    try {
      await setDoc(doc(db, 'users', uid, 'links', newId), newLink);
      notifySaveStatus('saved');
    } catch (err) {
      notifySaveStatus('error');
      handleFirestoreError(err, OperationType.CREATE, `users/${uid}/links/${newId}`);
      return { error: 'Failed to save link to database' };
    }

    return { link: newLink };
  }

  static addLink(
    link: Omit<LinkItem, 'id' | 'userId' | 'clicks' | 'position' | 'createdAt' | 'updatedAt'>
  ): { link?: LinkItem; error?: string } {
    assertFirebaseConfigured();
    const uid = AuthService.getSessionUserId();
    if (!uid) return { error: 'Not authenticated' };
    const newId = generateId();
    const now = new Date().toISOString();
    const newLink: LinkItem = {
      ...link,
      id: newId,
      userId: uid,
      position: cachedLinks.length,
      clicks: 0,
      createdAt: now,
      updatedAt: now,
    };
    cachedLinks = [...cachedLinks, newLink];
    notifyListeners();
    notifySaveStatus('saving');

    setDoc(doc(db, 'users', uid, 'links', newId), newLink)
      .then(() => notifySaveStatus('saved'))
      .catch((err) => {
        notifySaveStatus('error');
        handleFirestoreError(err, OperationType.CREATE, `users/${uid}/links/${newId}`);
      });

    return { link: newLink };
  }

  static async updateLinkAsync(id: string, partial: Partial<LinkItem>): Promise<LinkItem | null> {
    assertFirebaseConfigured();
    const uid = AuthService.getSessionUserId();
    if (!uid) return null;

    const now = new Date().toISOString();
    const target = cachedLinks.find((l) => l.id === id);
    if (!target) return null;

    const updated = { ...target, ...partial, updatedAt: now };
    cachedLinks = cachedLinks.map((l) => (l.id === id ? updated : l));
    notifyListeners();
    notifySaveStatus('saving');

    try {
      await setDoc(doc(db, 'users', uid, 'links', id), updated, { merge: true });
      notifySaveStatus('saved');
    } catch (err) {
      notifySaveStatus('error');
      handleFirestoreError(err, OperationType.UPDATE, `users/${uid}/links/${id}`);
    }

    return updated;
  }

  static updateLink(id: string, partial: Partial<LinkItem>): LinkItem | null {
    assertFirebaseConfigured();
    const uid = AuthService.getSessionUserId();
    if (!uid) return null;
    const target = cachedLinks.find((l) => l.id === id);
    if (!target) return null;
    const updated = { ...target, ...partial, updatedAt: new Date().toISOString() };
    cachedLinks = cachedLinks.map((l) => (l.id === id ? updated : l));
    notifyListeners();
    notifySaveStatus('saving');

    setDoc(doc(db, 'users', uid, 'links', id), updated, { merge: true })
      .then(() => notifySaveStatus('saved'))
      .catch((err) => {
        notifySaveStatus('error');
        handleFirestoreError(err, OperationType.UPDATE, `users/${uid}/links/${id}`);
      });

    return updated;
  }

  static async deleteLinkAsync(id: string): Promise<boolean> {
    assertFirebaseConfigured();
    const uid = AuthService.getSessionUserId();
    if (!uid) return false;

    cachedLinks = cachedLinks.filter((l) => l.id !== id).map((item, index) => ({
      ...item,
      position: index,
    }));
    notifyListeners();
    notifySaveStatus('saving');

    try {
      await deleteDoc(doc(db, 'users', uid, 'links', id));
      notifySaveStatus('saved');
    } catch (err) {
      notifySaveStatus('error');
      handleFirestoreError(err, OperationType.DELETE, `users/${uid}/links/${id}`);
      return false;
    }

    return true;
  }

  static deleteLink(id: string): boolean {
    assertFirebaseConfigured();
    const uid = AuthService.getSessionUserId();
    if (!uid) return false;

    cachedLinks = cachedLinks.filter((l) => l.id !== id).map((item, index) => ({
      ...item,
      position: index,
    }));
    notifyListeners();
    notifySaveStatus('saving');

    deleteDoc(doc(db, 'users', uid, 'links', id))
      .then(() => notifySaveStatus('saved'))
      .catch((err) => {
        notifySaveStatus('error');
        handleFirestoreError(err, OperationType.DELETE, `users/${uid}/links/${id}`);
      });

    return true;
  }

  static async reorderLinksAsync(orderedIds: string[]): Promise<LinkItem[]> {
    assertFirebaseConfigured();
    const uid = AuthService.getSessionUserId();
    if (!uid) return [];

    const linkMap = new Map(cachedLinks.map((l) => [l.id, l]));
    const reordered: LinkItem[] = [];
    const now = new Date().toISOString();

    orderedIds.forEach((id, index) => {
      const item = linkMap.get(id);
      if (item) {
        reordered.push({ ...item, position: index, updatedAt: now });
      }
    });

    cachedLinks = reordered;
    notifyListeners();
    notifySaveStatus('saving');

    try {
      const batch = writeBatch(db);
      reordered.forEach((item) => {
        batch.set(doc(db, 'users', uid, 'links', item.id), item);
      });
      await batch.commit();
      notifySaveStatus('saved');
    } catch (err) {
      notifySaveStatus('error');
      handleFirestoreError(err, OperationType.WRITE, `users/${uid}/links`);
    }

    return reordered;
  }

  static reorderLinks(orderedIds: string[]): LinkItem[] {
    StorageService.reorderLinksAsync(orderedIds);
    return cachedLinks;
  }

  // --- Theme Operations ---
  static getTheme(): ThemeConfig {
    if (cachedTheme) return cachedTheme;
    const uid = AuthService.getSessionUserId() || '';
    return presetToConfig(THEME_PRESETS[0], uid);
  }

  static getThemeSync(userId?: string): ThemeConfig {
    if (cachedTheme) return cachedTheme;
    const uid = userId || AuthService.getSessionUserId() || '';
    return presetToConfig(THEME_PRESETS[0], uid);
  }

  static async getThemeForUserAsync(userId: string): Promise<ThemeConfig> {
    if (cachedCurrentUser && cachedCurrentUser.id === userId && cachedTheme) {
      return cachedTheme;
    }
    assertFirebaseConfigured();
    try {
      const snap = await getDoc(doc(db, 'users', userId, 'theme', 'default'));
      if (snap.exists()) {
        return snap.data() as ThemeConfig;
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `users/${userId}/theme/default`);
    }
    return presetToConfig(THEME_PRESETS[0], userId);
  }

  static getThemeForUser(userId: string): ThemeConfig {
    if (userId === cachedCurrentUser?.id && cachedTheme) {
      return cachedTheme;
    }
    return presetToConfig(THEME_PRESETS[0], userId);
  }

  static async updateThemeAsync(partial: Partial<ThemeConfig>): Promise<ThemeConfig> {
    assertFirebaseConfigured();
    const uid = AuthService.getSessionUserId();
    const fallback = presetToConfig(THEME_PRESETS[0], uid || '');
    const current = cachedTheme || fallback;

    const updated: ThemeConfig = {
      ...current,
      ...partial,
      userId: uid || current.userId,
      updatedAt: new Date().toISOString(),
    };

    cachedTheme = updated;
    notifyListeners();
    notifySaveStatus('saving');

    if (uid) {
      try {
        await setDoc(doc(db, 'users', uid, 'theme', 'default'), updated);
        notifySaveStatus('saved');
      } catch (err) {
        notifySaveStatus('error');
        handleFirestoreError(err, OperationType.WRITE, `users/${uid}/theme/default`);
      }
    } else {
      notifySaveStatus('saved');
    }

    return updated;
  }

  static updateTheme(partial: Partial<ThemeConfig>): ThemeConfig {
    assertFirebaseConfigured();
    const uid = AuthService.getSessionUserId();
    const fallback = presetToConfig(THEME_PRESETS[0], uid || '');
    const current = cachedTheme || fallback;

    const updated: ThemeConfig = {
      ...current,
      ...partial,
      userId: uid || current.userId,
      updatedAt: new Date().toISOString(),
    };

    cachedTheme = updated;
    notifyListeners();
    notifySaveStatus('saving');

    if (uid) {
      setDoc(doc(db, 'users', uid, 'theme', 'default'), updated)
        .then(() => notifySaveStatus('saved'))
        .catch((err) => {
          notifySaveStatus('error');
          handleFirestoreError(err, OperationType.WRITE, `users/${uid}/theme/default`);
        });
    } else {
      notifySaveStatus('saved');
    }

    return updated;
  }

  // --- Socials Operations ---
  static getSocials(): SocialLinks {
    if (cachedSocials) return cachedSocials;
    const uid = AuthService.getSessionUserId() || '';
    return { id: 'default', userId: uid };
  }

  static getSocialsSync(userId?: string): SocialLinks {
    if (cachedSocials) return cachedSocials;
    const uid = userId || AuthService.getSessionUserId() || '';
    return { id: 'default', userId: uid };
  }

  static async getSocialsForUserAsync(userId: string): Promise<SocialLinks> {
    if (cachedCurrentUser && cachedCurrentUser.id === userId && cachedSocials) {
      return cachedSocials;
    }
    assertFirebaseConfigured();
    try {
      const snap = await getDoc(doc(db, 'users', userId, 'socials', 'default'));
      if (snap.exists()) {
        return snap.data() as SocialLinks;
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `users/${userId}/socials/default`);
    }
    return { id: 'default', userId };
  }

  static getSocialsForUser(userId: string): SocialLinks {
    if (userId === cachedCurrentUser?.id && cachedSocials) {
      return cachedSocials;
    }
    return { id: 'default', userId };
  }

  static async updateSocialsAsync(partial: Partial<SocialLinks>): Promise<SocialLinks> {
    assertFirebaseConfigured();
    const uid = AuthService.getSessionUserId();
    const current = cachedSocials || { id: 'default', userId: uid || '' };

    const updated: SocialLinks = {
      ...current,
      ...partial,
      userId: uid || current.userId,
    };

    cachedSocials = updated;
    notifyListeners();
    notifySaveStatus('saving');

    if (uid) {
      try {
        await setDoc(doc(db, 'users', uid, 'socials', 'default'), updated);
        notifySaveStatus('saved');
      } catch (err) {
        notifySaveStatus('error');
        handleFirestoreError(err, OperationType.WRITE, `users/${uid}/socials/default`);
      }
    } else {
      notifySaveStatus('saved');
    }

    return updated;
  }

  static updateSocials(partial: Partial<SocialLinks>): SocialLinks {
    assertFirebaseConfigured();
    const uid = AuthService.getSessionUserId();
    const current = cachedSocials || { id: 'default', userId: uid || '' };

    const updated: SocialLinks = {
      ...current,
      ...partial,
      userId: uid || current.userId,
    };

    cachedSocials = updated;
    notifyListeners();
    notifySaveStatus('saving');

    if (uid) {
      setDoc(doc(db, 'users', uid, 'socials', 'default'), updated)
        .then(() => notifySaveStatus('saved'))
        .catch((err) => {
          notifySaveStatus('error');
          handleFirestoreError(err, OperationType.WRITE, `users/${uid}/socials/default`);
        });
    } else {
      notifySaveStatus('saved');
    }

    return updated;
  }

  // --- Analytics Operations ---
  static getAnalytics(): AnalyticsEvent[] {
    return cachedAnalytics;
  }

  static getAnalyticsSync(userId?: string): AnalyticsEvent[] {
    if (!userId || userId === cachedCurrentUser?.id) {
      return cachedAnalytics;
    }
    return [];
  }

  static async trackEvent(
    userId: string,
    event: 'view' | 'click',
    meta?: { linkId?: string; referrer?: string }
  ): Promise<void> {
    if (!userId || !isFirebaseConfigured) return;

    const eventId = generateId();
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Tablet/i.test(userAgent);
    const device = isTablet ? 'Tablet' : isMobile ? 'Mobile' : 'Desktop';

    let referrer = meta?.referrer;
    if (!referrer && typeof document !== 'undefined' && document.referrer) {
      try {
        referrer = new URL(document.referrer).hostname;
      } catch {
        referrer = 'Direct';
      }
    }
    if (!referrer) referrer = 'Direct';

    const eventRecord: AnalyticsEvent = {
      id: eventId,
      userId,
      linkId: meta?.linkId || null,
      event,
      device,
      referrer,
      userAgent,
      createdAt: new Date().toISOString(),
    };

    if (userId === cachedCurrentUser?.id) {
      cachedAnalytics = [...cachedAnalytics, eventRecord];
      if (event === 'click' && meta?.linkId) {
        cachedLinks = cachedLinks.map((l) =>
          l.id === meta.linkId ? { ...l, clicks: (l.clicks || 0) + 1 } : l
        );
      }
      notifyListeners();
    }

    try {
      await setDoc(doc(db, 'users', userId, 'analytics', eventId), eventRecord);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${userId}/analytics/${eventId}`);
    }

    if (event === 'click' && meta?.linkId) {
      try {
        const linkRef = doc(db, 'users', userId, 'links', meta.linkId);
        const linkSnap = await getDoc(linkRef);
        if (linkSnap.exists()) {
          const lData = linkSnap.data() as LinkItem;
          await updateDoc(linkRef, { clicks: (lData.clicks || 0) + 1 });
        }
      } catch {
        // non-blocking
      }
    }
  }

  static getAnalyticsSummary(days = 7, userId?: string): AnalyticsSummary {
    const events = cachedAnalytics;
    const links = cachedLinks;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const filtered = events.filter((e) => new Date(e.createdAt) >= cutoff);
    const viewEvents = filtered.filter((e) => e.event === 'view');
    const clickEvents = filtered.filter((e) => e.event === 'click');

    const totalViews = viewEvents.length;
    const totalClicks = clickEvents.length;
    const clickRate = totalViews > 0 ? Number(((totalClicks / totalViews) * 100).toFixed(1)) : 0;

    const uniqueIdentifiers = new Set(filtered.map((e) => e.userAgent || e.id));
    const uniqueVisitors = uniqueIdentifiers.size;

    const chartMap = new Map<string, { views: number; clicks: number }>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      chartMap.set(key, { views: 0, clicks: 0 });
    }

    filtered.forEach((e) => {
      const key = new Date(e.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const current = chartMap.get(key);
      if (current) {
        if (e.event === 'view') current.views++;
        if (e.event === 'click') current.clicks++;
      }
    });

    const chartData = Array.from(chartMap.entries()).map(([date, counts]) => ({
      date,
      views: counts.views,
      clicks: counts.clicks,
    }));

    const linkClickMap = new Map<string, number>();
    clickEvents.forEach((e) => {
      if (e.linkId) {
        linkClickMap.set(e.linkId, (linkClickMap.get(e.linkId) || 0) + 1);
      }
    });

    const topLinks = links
      .map((l) => ({
        id: l.id,
        title: l.title,
        url: l.url,
        clicks: linkClickMap.get(l.id) || l.clicks || 0,
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5);

    const deviceMap = new Map<string, number>();
    filtered.forEach((e) => {
      const d = e.device || 'Desktop';
      deviceMap.set(d, (deviceMap.get(d) || 0) + 1);
    });

    const totalWithDevice = filtered.length || 1;
    const devices = Array.from(deviceMap.entries())
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalWithDevice) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    const referrerMap = new Map<string, number>();
    filtered.forEach((e) => {
      const r = e.referrer || 'Direct';
      referrerMap.set(r, (referrerMap.get(r) || 0) + 1);
    });

    const totalWithReferrer = filtered.length || 1;
    const referrers = Array.from(referrerMap.entries())
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalWithReferrer) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalViews,
      totalClicks,
      uniqueVisitors,
      clickRate,
      chartData,
      topLinks,
      devices,
      referrers,
      recentEvents: [...filtered].reverse().slice(0, 10),
    };
  }

  static async exportData(): Promise<Blob> {
    const user = cachedCurrentUser;
    const exportBundle = {
      app: 'LinkVM',
      domain: 'linkvm.online',
      exportedAt: new Date().toISOString(),
      user,
      links: cachedLinks,
      theme: cachedTheme,
      socials: cachedSocials,
      analytics: cachedAnalytics,
    };

    const json = JSON.stringify(exportBundle, null, 2);
    return new Blob([json], { type: 'application/json' });
  }

  static async deleteAccount(): Promise<boolean> {
    await AuthService.deleteAccount();
    return true;
  }

  static subscribeSaveStatus(listener: (status: SaveStatus) => void): () => void {
    return subscribeSaveStatus(listener);
  }
}
