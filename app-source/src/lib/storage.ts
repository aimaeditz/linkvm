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

export interface StoredUserAccount extends User {}

export const LOCAL_STORAGE_KEY_USER = 'linkvm_local_user';
export const LOCAL_STORAGE_KEY_LINKS = 'linkvm_local_links';
export const LOCAL_STORAGE_KEY_THEME = 'linkvm_local_theme';
export const LOCAL_STORAGE_KEY_SOCIALS = 'linkvm_local_socials';
export const LOCAL_STORAGE_KEY_ANALYTICS = 'linkvm_local_analytics';
export const LOCAL_STORAGE_KEY_USERS = 'linkvm_local_users';

export function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const val = localStorage.getItem(key);
    return val ? (JSON.parse(val) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function setStored<T>(key: string, val: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // quota
  }
}

export const DEMO_USER: User = {
  id: 'usr_demo_creator',
  name: 'Alex Rivera',
  displayName: 'Alex Rivera',
  email: 'alex@linkvm.online',
  username: 'alex',
  bio: 'Digital Creator & Product Designer | Sharing resources, tools & tutorials',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces',
  sharePattern: '{username}',
  invitesSent: 4,
  invitesAccepted: 2,
  referralCode: 'alex-4921',
  googleSub: 'usr_demo_creator',
  googleEmail: 'alex@linkvm.online',
  googleName: 'Alex Rivera',
  googlePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces',
  notifications: {
    weeklySummary: true,
    securityAlerts: true,
  },
  privacy: {
    searchIndexing: true,
    anonymousAnalytics: false,
  },
  hasSharedAt: null,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

export const DEMO_LINKS: LinkItem[] = [
  {
    id: 'demo-link-1',
    userId: 'usr_demo_creator',
    title: 'Watch Latest YouTube Tutorial',
    url: 'https://youtube.com',
    icon: 'youtube',
    clicks: 1420,
    visible: true,
    openInNew: true,
    position: 0,
    animation: 'pulse',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'demo-link-2',
    userId: 'usr_demo_creator',
    title: 'Download Free Figma UI Kit',
    url: 'https://figma.com',
    icon: 'figma',
    clicks: 2854,
    visible: true,
    openInNew: true,
    position: 1,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'demo-link-3',
    userId: 'usr_demo_creator',
    title: 'Join Creator Community on Discord',
    url: 'https://discord.gg',
    icon: 'discord',
    clicks: 980,
    visible: true,
    openInNew: true,
    position: 2,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'demo-link-4',
    userId: 'usr_demo_creator',
    title: 'Read My Weekly Newsletter on Substack',
    url: 'https://substack.com',
    icon: 'mail',
    clicks: 642,
    visible: true,
    openInNew: true,
    position: 3,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
];

export function createLocalUser(name: string, email: string): User {
  const cleanName = name.trim() || 'Creator';
  const localPart = email.split('@')[0] || 'user';
  let baseUsername = slugify(localPart).slice(0, 16);
  if (baseUsername.length < 3) baseUsername = `user_${baseUsername}`;
  const randSuffix = Math.floor(100 + Math.random() * 900);
  const username = `${baseUsername}${randSuffix}`;
  const now = new Date().toISOString();
  const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  return {
    id,
    email: email.trim(),
    displayName: cleanName,
    name: cleanName,
    photoURL: '',
    avatarUrl: '',
    username,
    bio: '',
    sharePattern: '{username}',
    invitesSent: 0,
    invitesAccepted: 0,
    referralCode: `${username}-${Math.floor(1000 + Math.random() * 9000)}`,
    googleSub: id,
    googleEmail: email.trim(),
    googleName: cleanName,
    googlePicture: '',
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
}

// In-memory cache for synchronous render compatibility, backed by localStorage
let cachedCurrentUser: User | null = getStored<User | null>(LOCAL_STORAGE_KEY_USER, null);
let cachedLinks: LinkItem[] = getStored<LinkItem[]>(LOCAL_STORAGE_KEY_LINKS, []);
let cachedTheme: ThemeConfig | null = getStored<ThemeConfig | null>(LOCAL_STORAGE_KEY_THEME, null);
let cachedSocials: SocialLinks | null = getStored<SocialLinks | null>(LOCAL_STORAGE_KEY_SOCIALS, null);
let cachedAnalytics: AnalyticsEvent[] = getStored<AnalyticsEvent[]>(LOCAL_STORAGE_KEY_ANALYTICS, []);

type StateChangeListener = () => void;
const listeners: Set<StateChangeListener> = new Set();

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

// Global Auth State Listener
if (isFirebaseConfigured) {
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        await syncUserFromFirebase(firebaseUser);
      } catch (err) {
        console.error('Error syncing user on auth change:', err);
      }
    } else {
      cachedCurrentUser = null;
      cachedLinks = [];
      cachedTheme = null;
      cachedSocials = null;
      cachedAnalytics = [];
      setStored(LOCAL_STORAGE_KEY_USER, null);
      setStored(LOCAL_STORAGE_KEY_LINKS, []);
      setStored(LOCAL_STORAGE_KEY_THEME, null);
      setStored(LOCAL_STORAGE_KEY_SOCIALS, null);
      setStored(LOCAL_STORAGE_KEY_ANALYTICS, []);
      notifyListeners();
    }
  });
}

export async function checkUsernameAvailableInFirestore(rawUsername: string): Promise<boolean> {
  const clean = slugify(rawUsername);
  if (!clean || clean.length < 3 || clean.length > 30) return false;
  const val = validateUsername(clean);
  if (!val.valid) return false;

  if (clean === 'alex' || clean === 'demo') {
    if (auth.currentUser?.uid === DEMO_USER.id || cachedCurrentUser?.id === DEMO_USER.id) return true;
    return false;
  }

  const localUsers = getStored<User[]>(LOCAL_STORAGE_KEY_USERS, []);
  const existing = localUsers.find((u) => u.username.toLowerCase() === clean);
  if (existing) {
    if (cachedCurrentUser && existing.id === cachedCurrentUser.id) return true;
    return false;
  }

  if (isFirebaseConfigured) {
    try {
      const unameDocRef = doc(db, 'usernames', clean);
      const snap = await getDoc(unameDocRef);
      if (snap.exists()) {
        const data = snap.data();
        if (auth.currentUser && data.uid === auth.currentUser.uid) {
          return true;
        }
        return false;
      }
      return true;
    } catch {
      return true;
    }
  }
  return true;
}

export async function syncUserFromFirebase(firebaseUser: FirebaseUser, fallbackName?: string): Promise<User> {
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
    // Generate initial unique username
    let chosenUsername = AuthService.generateUniqueUsername(firebaseUser.email || 'user');
    let isAvail = await checkUsernameAvailableInFirestore(chosenUsername);
    if (!isAvail) {
      chosenUsername = `${chosenUsername}${Math.floor(100 + Math.random() * 900)}`;
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
    }
  }

  cachedCurrentUser = userData;

  // Load user links
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
  }

  // Load user theme
  try {
    const themeSnap = await getDoc(doc(db, 'users', uid, 'theme', 'default'));
    if (themeSnap.exists()) {
      cachedTheme = themeSnap.data() as ThemeConfig;
    } else {
      cachedTheme = presetToConfig(THEME_PRESETS[0], uid);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${uid}/theme/default`);
  }

  // Load user socials
  try {
    const socialsSnap = await getDoc(doc(db, 'users', uid, 'socials', 'default'));
    if (socialsSnap.exists()) {
      cachedSocials = socialsSnap.data() as SocialLinks;
    } else {
      cachedSocials = { id: 'default', userId: uid };
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${uid}/socials/default`);
  }

  // Load analytics
  try {
    const analyticsSnap = await getDocs(collection(db, 'users', uid, 'analytics'));
    const loadedEvents: AnalyticsEvent[] = [];
    analyticsSnap.forEach((docSnap) => {
      loadedEvents.push(docSnap.data() as AnalyticsEvent);
    });
    cachedAnalytics = loadedEvents;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, `users/${uid}/analytics`);
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
    const trimmedEmail = email.trim();
    if (isFirebaseConfigured) {
      try {
        const result = await signInWithEmailAndPassword(auth, trimmedEmail, password);
        const user = await syncUserFromFirebase(result.user);
        return user;
      } catch (err) {
        const code = (err as { code?: string })?.code || '';
        if (
          code === 'auth/wrong-password' ||
          code === 'auth/user-not-found' ||
          code === 'auth/invalid-credential'
        ) {
          throw err;
        }
        console.warn('Firebase login unavailable, using local authentication:', err);
      }
    }

    const localUsers = getStored<User[]>(LOCAL_STORAGE_KEY_USERS, []);
    let user = localUsers.find((u) => u.email.toLowerCase() === trimmedEmail.toLowerCase());
    if (!user) {
      if (trimmedEmail.toLowerCase() === DEMO_USER.email.toLowerCase()) {
        user = DEMO_USER;
      } else {
        const name = trimmedEmail.split('@')[0] || 'Creator';
        user = createLocalUser(name, trimmedEmail);
        localUsers.push(user);
        setStored(LOCAL_STORAGE_KEY_USERS, localUsers);
      }
    }

    cachedCurrentUser = user;
    setStored(LOCAL_STORAGE_KEY_USER, user);
    const userLinks = getStored<LinkItem[]>(
      `${LOCAL_STORAGE_KEY_LINKS}_${user.id}`,
      user.id === DEMO_USER.id ? DEMO_LINKS : []
    );
    cachedLinks = userLinks.length > 0 ? userLinks : DEMO_LINKS.map((l) => ({ ...l, id: generateId(), userId: user!.id }));
    setStored(LOCAL_STORAGE_KEY_LINKS, cachedLinks);
    setStored(`${LOCAL_STORAGE_KEY_LINKS}_${user.id}`, cachedLinks);

    cachedTheme = getStored<ThemeConfig | null>(
      `${LOCAL_STORAGE_KEY_THEME}_${user.id}`,
      presetToConfig(THEME_PRESETS[0], user.id)
    );
    setStored(LOCAL_STORAGE_KEY_THEME, cachedTheme);

    cachedSocials = getStored<SocialLinks | null>(
      `${LOCAL_STORAGE_KEY_SOCIALS}_${user.id}`,
      { id: 'default', userId: user.id }
    );
    setStored(LOCAL_STORAGE_KEY_SOCIALS, cachedSocials);

    notifyListeners();
    return user;
  }

  static async signupWithEmail(name: string, email: string, password: string): Promise<User> {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (isFirebaseConfigured) {
      try {
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
      } catch (err) {
        const code = (err as { code?: string })?.code || '';
        if (code === 'auth/email-already-in-use') {
          throw err;
        }
        console.warn('Firebase signup unavailable, creating local account:', err);
      }
    }

    const localUsers = getStored<User[]>(LOCAL_STORAGE_KEY_USERS, []);
    const existing = localUsers.find((u) => u.email.toLowerCase() === trimmedEmail.toLowerCase());
    if (existing) {
      const err = new Error('An account with this email already exists. Please sign in instead.');
      (err as { code?: string }).code = 'auth/email-already-in-use';
      throw err;
    }

    const user = createLocalUser(trimmedName, trimmedEmail);
    localUsers.push(user);
    setStored(LOCAL_STORAGE_KEY_USERS, localUsers);

    cachedCurrentUser = user;
    setStored(LOCAL_STORAGE_KEY_USER, user);

    const initialLinks = DEMO_LINKS.map((l) => ({ ...l, id: generateId(), userId: user.id }));
    cachedLinks = initialLinks;
    setStored(LOCAL_STORAGE_KEY_LINKS, initialLinks);
    setStored(`${LOCAL_STORAGE_KEY_LINKS}_${user.id}`, initialLinks);

    const initialTheme = presetToConfig(THEME_PRESETS[0], user.id);
    cachedTheme = initialTheme;
    setStored(LOCAL_STORAGE_KEY_THEME, initialTheme);
    setStored(`${LOCAL_STORAGE_KEY_THEME}_${user.id}`, initialTheme);

    const initialSocials = { id: 'default', userId: user.id };
    cachedSocials = initialSocials;
    setStored(LOCAL_STORAGE_KEY_SOCIALS, initialSocials);
    setStored(`${LOCAL_STORAGE_KEY_SOCIALS}_${user.id}`, initialSocials);

    notifyListeners();
    return user;
  }

  static async sendPasswordReset(email: string): Promise<void> {
    if (isFirebaseConfigured) {
      try {
        await sendPasswordResetEmail(auth, email.trim());
        return;
      } catch (err) {
        console.warn('Firebase password reset error:', err);
      }
    }
  }

  static async loginWithGoogle(): Promise<{ user?: User; error?: string }> {
    if (isFirebaseConfigured) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = await syncUserFromFirebase(result.user);
        return { user };
      } catch (err) {
        console.warn('Google Sign-In popup error, activating demo creator session:', err);
      }
    }

    const user = DEMO_USER;
    cachedCurrentUser = user;
    setStored(LOCAL_STORAGE_KEY_USER, user);
    cachedLinks = DEMO_LINKS;
    setStored(LOCAL_STORAGE_KEY_LINKS, DEMO_LINKS);
    cachedTheme = presetToConfig(THEME_PRESETS[0], user.id);
    setStored(LOCAL_STORAGE_KEY_THEME, cachedTheme);
    cachedSocials = { id: 'default', userId: user.id, instagram: 'alexrivera', youtube: 'alexrivera', twitter: 'alexrivera' };
    setStored(LOCAL_STORAGE_KEY_SOCIALS, cachedSocials);
    notifyListeners();
    return { user };
  }

  static async loginWithGoogleFirebase(): Promise<User> {
    const res = await AuthService.loginWithGoogle();
    if (res.error || !res.user) {
      throw new Error(res.error || 'Google sign-in failed');
    }
    return res.user;
  }

  static async logout(): Promise<void> {
    if (isFirebaseConfigured) {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn('Sign-out error:', err);
      }
    }
    cachedCurrentUser = null;
    cachedLinks = [];
    cachedTheme = null;
    cachedSocials = null;
    cachedAnalytics = [];
    setStored(LOCAL_STORAGE_KEY_USER, null);
    setStored(LOCAL_STORAGE_KEY_LINKS, []);
    setStored(LOCAL_STORAGE_KEY_THEME, null);
    setStored(LOCAL_STORAGE_KEY_SOCIALS, null);
    setStored(LOCAL_STORAGE_KEY_ANALYTICS, []);
    notifyListeners();
  }

  static getCurrentUserSync(): User | null {
    return cachedCurrentUser;
  }

  static async getCurrentUser(): Promise<User | null> {
    if (auth.currentUser && isFirebaseConfigured) {
      if (!cachedCurrentUser || cachedCurrentUser.id !== auth.currentUser.uid) {
        await syncUserFromFirebase(auth.currentUser);
      }
    }
    return cachedCurrentUser;
  }

  static async checkUsernameAvailable(username: string): Promise<boolean> {
    return checkUsernameAvailableInFirestore(username);
  }

  static generateUniqueUsername(email: string): string {
    const localPart = email.split('@')[0] || 'user';
    let base = slugify(localPart).slice(0, 16);
    if (base.length < 3) base = `user_${base}`;
    return base;
  }

  static async updateProfile(partial: Partial<User>): Promise<{ user?: User; error?: string }> {
    const uid = AuthService.getSessionUserId();
    if (!uid && !cachedCurrentUser) return { error: 'Unauthorized' };

    const currentUid = uid || cachedCurrentUser!.id;
    const now = new Date().toISOString();

    if (partial.username && cachedCurrentUser && partial.username !== cachedCurrentUser.username) {
      const cleanUsername = slugify(partial.username);
      const val = validateUsername(cleanUsername);
      if (!val.valid) {
        return { error: val.error || 'Invalid username.' };
      }

      const isAvail = await checkUsernameAvailableInFirestore(cleanUsername);
      if (!isAvail) {
        return { error: 'This username is already taken or reserved.' };
      }

      if (isFirebaseConfigured && auth.currentUser) {
        try {
          await runTransaction(db, async (transaction) => {
            const oldUnameRef = doc(db, 'usernames', cachedCurrentUser!.username);
            const newUnameRef = doc(db, 'usernames', cleanUsername);
            const userRef = doc(db, 'users', currentUid);

            transaction.delete(oldUnameRef);
            transaction.set(newUnameRef, { uid: currentUid, createdAt: now });
            transaction.update(userRef, {
              ...partial,
              username: cleanUsername,
              updatedAt: now,
            });
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `users/${currentUid}`);
        }
      }

      if (cachedCurrentUser) {
        cachedCurrentUser = {
          ...cachedCurrentUser,
          ...partial,
          username: cleanUsername,
          updatedAt: now,
        };
        setStored(LOCAL_STORAGE_KEY_USER, cachedCurrentUser);
      }

      const localUsers = getStored<User[]>(LOCAL_STORAGE_KEY_USERS, []);
      const updatedList = localUsers.map((u) => (u.id === currentUid ? { ...u, ...partial, username: cleanUsername, updatedAt: now } : u));
      setStored(LOCAL_STORAGE_KEY_USERS, updatedList);

      notifyListeners();
      return { user: cachedCurrentUser! };
    }

    const updatedUser: User = {
      ...(cachedCurrentUser || {
        id: currentUid,
        email: '',
        name: 'Creator',
        username: 'user',
        createdAt: now,
        updatedAt: now,
      }),
      ...partial,
      updatedAt: now,
    };

    if (isFirebaseConfigured && auth.currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUid), updatedUser, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUid}`);
      }
    }

    cachedCurrentUser = updatedUser;
    setStored(LOCAL_STORAGE_KEY_USER, updatedUser);

    const localUsers = getStored<User[]>(LOCAL_STORAGE_KEY_USERS, []);
    const updatedList = localUsers.map((u) => (u.id === currentUid ? updatedUser : u));
    setStored(LOCAL_STORAGE_KEY_USERS, updatedList);

    notifyListeners();
    return { user: updatedUser };
  }

  static async deleteAccount(): Promise<void> {
    const current = auth.currentUser;
    const uid = current?.uid || cachedCurrentUser?.id;
    if (!uid) return;

    if (isFirebaseConfigured && current) {
      try {
        const batch = writeBatch(db);

        // Delete username doc
        if (cachedCurrentUser?.username) {
          batch.delete(doc(db, 'usernames', cachedCurrentUser.username));
        }

        // Links
        const linksSnap = await getDocs(collection(db, 'users', uid, 'links'));
        linksSnap.forEach((d) => batch.delete(d.ref));

        // Theme
        batch.delete(doc(db, 'users', uid, 'theme', 'default'));

        // Socials
        batch.delete(doc(db, 'users', uid, 'socials', 'default'));

        // Analytics
        const analyticsSnap = await getDocs(collection(db, 'users', uid, 'analytics'));
        analyticsSnap.forEach((d) => batch.delete(d.ref));

        // User document
        batch.delete(doc(db, 'users', uid));

        await batch.commit();
        await deleteUser(current);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${uid}`);
      }
    }

    cachedCurrentUser = null;
    cachedLinks = [];
    cachedTheme = null;
    cachedSocials = null;
    cachedAnalytics = [];
    setStored(LOCAL_STORAGE_KEY_USER, null);
    setStored(LOCAL_STORAGE_KEY_LINKS, []);
    setStored(LOCAL_STORAGE_KEY_THEME, null);
    setStored(LOCAL_STORAGE_KEY_SOCIALS, null);
    setStored(LOCAL_STORAGE_KEY_ANALYTICS, []);
    notifyListeners();
  }
}

export class StorageService {
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
    const clean = username.replace(/^[@$\-+!~]/, '').toLowerCase().trim();
    if (!clean) return null;

    if (clean === 'alex' || clean === 'demo') {
      return DEMO_USER;
    }

    if (cachedCurrentUser && cachedCurrentUser.username.toLowerCase() === clean) {
      return cachedCurrentUser;
    }

    const localUsers = getStored<User[]>(LOCAL_STORAGE_KEY_USERS, []);
    const localFound = localUsers.find((u) => u.username.toLowerCase() === clean);
    if (localFound) return localFound;

    if (isFirebaseConfigured) {
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

        const directUserSnap = await getDoc(doc(db, 'users', clean));
        if (directUserSnap.exists()) {
          return directUserSnap.data() as User;
        }
      } catch (err) {
        console.warn('Could not find user by username in Firestore:', clean, err);
      }
    }

    return null;
  }

  static findUserByUsername(username: string): User | null {
    const clean = username.replace(/^[@$\-+!~]/, '').toLowerCase().trim();
    if (clean === 'alex' || clean === 'demo') {
      return DEMO_USER;
    }
    if (cachedCurrentUser && cachedCurrentUser.username.toLowerCase() === clean) {
      return cachedCurrentUser;
    }
    const localUsers = getStored<User[]>(LOCAL_STORAGE_KEY_USERS, []);
    const localFound = localUsers.find((u) => u.username.toLowerCase() === clean);
    if (localFound) return localFound;
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
      setStored(LOCAL_STORAGE_KEY_USER, cachedCurrentUser);
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
    if (userId === DEMO_USER.id) {
      return DEMO_LINKS;
    }
    const userLinks = getStored<LinkItem[]>(`${LOCAL_STORAGE_KEY_LINKS}_${userId}`, []);
    return userLinks;
  }

  static async getLinksForUserAsync(userId: string): Promise<LinkItem[]> {
    if (userId === DEMO_USER.id) {
      return DEMO_LINKS;
    }
    if (cachedCurrentUser && cachedCurrentUser.id === userId) {
      return cachedLinks.filter((l) => l.visible).sort((a, b) => a.position - b.position);
    }
    const localLinks = getStored<LinkItem[]>(`${LOCAL_STORAGE_KEY_LINKS}_${userId}`, []);
    if (localLinks.length > 0) {
      return localLinks.filter((l) => l.visible).sort((a, b) => a.position - b.position);
    }
    if (isFirebaseConfigured) {
      try {
        const snap = await getDocs(collection(db, 'users', userId, 'links'));
        const links: LinkItem[] = [];
        snap.forEach((d) => links.push(d.data() as LinkItem));
        return links.filter((l) => l.visible).sort((a, b) => a.position - b.position);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, `users/${userId}/links`);
      }
    }
    return [];
  }

  static getLinksForUser(userId: string): LinkItem[] {
    if (userId === DEMO_USER.id) {
      return DEMO_LINKS;
    }
    if (userId === cachedCurrentUser?.id) {
      return cachedLinks.filter((l) => l.visible);
    }
    const localLinks = getStored<LinkItem[]>(`${LOCAL_STORAGE_KEY_LINKS}_${userId}`, []);
    if (localLinks.length > 0) {
      return localLinks.filter((l) => l.visible).sort((a, b) => a.position - b.position);
    }
    return [];
  }

  static async addLinkAsync(
    link: Omit<LinkItem, 'id' | 'userId' | 'clicks' | 'position' | 'createdAt' | 'updatedAt'>
  ): Promise<{ link?: LinkItem; error?: string }> {
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
    setStored(LOCAL_STORAGE_KEY_LINKS, cachedLinks);
    setStored(`${LOCAL_STORAGE_KEY_LINKS}_${uid}`, cachedLinks);
    notifyListeners();

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'users', uid, 'links', newId), newLink);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${uid}/links/${newId}`);
      }
    }

    return { link: newLink };
  }

  static addLink(
    link: Omit<LinkItem, 'id' | 'userId' | 'clicks' | 'position' | 'createdAt' | 'updatedAt'>
  ): { link?: LinkItem; error?: string } {
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
    setStored(LOCAL_STORAGE_KEY_LINKS, cachedLinks);
    setStored(`${LOCAL_STORAGE_KEY_LINKS}_${uid}`, cachedLinks);
    notifyListeners();

    if (isFirebaseConfigured) {
      setDoc(doc(db, 'users', uid, 'links', newId), newLink).catch((err) => {
        handleFirestoreError(err, OperationType.CREATE, `users/${uid}/links/${newId}`);
      });
    }

    return { link: newLink };
  }

  static async updateLinkAsync(id: string, partial: Partial<LinkItem>): Promise<LinkItem | null> {
    const uid = AuthService.getSessionUserId();
    if (!uid) return null;

    const now = new Date().toISOString();
    const target = cachedLinks.find((l) => l.id === id);
    if (!target) return null;

    const updated = { ...target, ...partial, updatedAt: now };
    cachedLinks = cachedLinks.map((l) => (l.id === id ? updated : l));
    setStored(LOCAL_STORAGE_KEY_LINKS, cachedLinks);
    setStored(`${LOCAL_STORAGE_KEY_LINKS}_${uid}`, cachedLinks);
    notifyListeners();

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'users', uid, 'links', id), updated, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${uid}/links/${id}`);
      }
    }

    return updated;
  }

  static updateLink(id: string, partial: Partial<LinkItem>): LinkItem | null {
    const uid = AuthService.getSessionUserId();
    if (!uid) return null;
    const target = cachedLinks.find((l) => l.id === id);
    if (!target) return null;
    const updated = { ...target, ...partial, updatedAt: new Date().toISOString() };
    cachedLinks = cachedLinks.map((l) => (l.id === id ? updated : l));
    setStored(LOCAL_STORAGE_KEY_LINKS, cachedLinks);
    setStored(`${LOCAL_STORAGE_KEY_LINKS}_${uid}`, cachedLinks);
    notifyListeners();

    if (isFirebaseConfigured) {
      setDoc(doc(db, 'users', uid, 'links', id), updated, { merge: true }).catch((err) => {
        handleFirestoreError(err, OperationType.UPDATE, `users/${uid}/links/${id}`);
      });
    }

    return updated;
  }

  static async deleteLinkAsync(id: string): Promise<boolean> {
    const uid = AuthService.getSessionUserId();
    if (!uid) return false;

    cachedLinks = cachedLinks.filter((l) => l.id !== id).map((item, index) => ({
      ...item,
      position: index,
    }));
    setStored(LOCAL_STORAGE_KEY_LINKS, cachedLinks);
    setStored(`${LOCAL_STORAGE_KEY_LINKS}_${uid}`, cachedLinks);
    notifyListeners();

    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, 'users', uid, 'links', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${uid}/links/${id}`);
      }
    }

    return true;
  }

  static deleteLink(id: string): boolean {
    const uid = AuthService.getSessionUserId();
    if (!uid) return false;

    cachedLinks = cachedLinks.filter((l) => l.id !== id).map((item, index) => ({
      ...item,
      position: index,
    }));
    setStored(LOCAL_STORAGE_KEY_LINKS, cachedLinks);
    setStored(`${LOCAL_STORAGE_KEY_LINKS}_${uid}`, cachedLinks);
    notifyListeners();

    if (isFirebaseConfigured) {
      deleteDoc(doc(db, 'users', uid, 'links', id)).catch((err) => {
        handleFirestoreError(err, OperationType.DELETE, `users/${uid}/links/${id}`);
      });
    }

    return true;
  }

  static async reorderLinksAsync(orderedIds: string[]): Promise<LinkItem[]> {
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
    setStored(LOCAL_STORAGE_KEY_LINKS, cachedLinks);
    setStored(`${LOCAL_STORAGE_KEY_LINKS}_${uid}`, cachedLinks);
    notifyListeners();

    if (isFirebaseConfigured) {
      try {
        const batch = writeBatch(db);
        reordered.forEach((item) => {
          batch.set(doc(db, 'users', uid, 'links', item.id), item);
        });
        await batch.commit();
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${uid}/links`);
      }
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
    if (userId === DEMO_USER.id) {
      return presetToConfig(THEME_PRESETS[0], DEMO_USER.id);
    }
    if (cachedCurrentUser && cachedCurrentUser.id === userId && cachedTheme) {
      return cachedTheme;
    }
    const stored = getStored<ThemeConfig | null>(`${LOCAL_STORAGE_KEY_THEME}_${userId}`, null);
    if (stored) return stored;

    if (isFirebaseConfigured) {
      try {
        const snap = await getDoc(doc(db, 'users', userId, 'theme', 'default'));
        if (snap.exists()) {
          return snap.data() as ThemeConfig;
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `users/${userId}/theme/default`);
      }
    }
    return presetToConfig(THEME_PRESETS[0], userId);
  }

  static getThemeForUser(userId: string): ThemeConfig {
    if (userId === DEMO_USER.id) {
      return presetToConfig(THEME_PRESETS[0], DEMO_USER.id);
    }
    if (userId === cachedCurrentUser?.id && cachedTheme) {
      return cachedTheme;
    }
    const stored = getStored<ThemeConfig | null>(`${LOCAL_STORAGE_KEY_THEME}_${userId}`, null);
    if (stored) return stored;
    return presetToConfig(THEME_PRESETS[0], userId);
  }

  static async updateThemeAsync(partial: Partial<ThemeConfig>): Promise<ThemeConfig> {
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
    setStored(LOCAL_STORAGE_KEY_THEME, updated);
    if (uid) {
      setStored(`${LOCAL_STORAGE_KEY_THEME}_${uid}`, updated);
    }
    notifyListeners();

    if (isFirebaseConfigured && uid) {
      try {
        await setDoc(doc(db, 'users', uid, 'theme', 'default'), updated);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${uid}/theme/default`);
      }
    }

    return updated;
  }

  static updateTheme(partial: Partial<ThemeConfig>): ThemeConfig {
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
    setStored(LOCAL_STORAGE_KEY_THEME, updated);
    if (uid) {
      setStored(`${LOCAL_STORAGE_KEY_THEME}_${uid}`, updated);
    }
    notifyListeners();

    if (isFirebaseConfigured && uid) {
      setDoc(doc(db, 'users', uid, 'theme', 'default'), updated).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `users/${uid}/theme/default`);
      });
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
    if (userId === DEMO_USER.id) {
      return { id: 'default', userId: DEMO_USER.id, instagram: 'alexrivera', youtube: 'alexrivera', twitter: 'alexrivera', github: 'alexrivera' };
    }
    if (cachedCurrentUser && cachedCurrentUser.id === userId && cachedSocials) {
      return cachedSocials;
    }
    const stored = getStored<SocialLinks | null>(`${LOCAL_STORAGE_KEY_SOCIALS}_${userId}`, null);
    if (stored) return stored;

    if (isFirebaseConfigured) {
      try {
        const snap = await getDoc(doc(db, 'users', userId, 'socials', 'default'));
        if (snap.exists()) {
          return snap.data() as SocialLinks;
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `users/${userId}/socials/default`);
      }
    }
    return { id: 'default', userId };
  }

  static getSocialsForUser(userId: string): SocialLinks {
    if (userId === DEMO_USER.id) {
      return { id: 'default', userId: DEMO_USER.id, instagram: 'alexrivera', youtube: 'alexrivera', twitter: 'alexrivera', github: 'alexrivera' };
    }
    if (userId === cachedCurrentUser?.id && cachedSocials) {
      return cachedSocials;
    }
    const stored = getStored<SocialLinks | null>(`${LOCAL_STORAGE_KEY_SOCIALS}_${userId}`, null);
    if (stored) return stored;
    return { id: 'default', userId };
  }

  static async updateSocialsAsync(partial: Partial<SocialLinks>): Promise<SocialLinks> {
    const uid = AuthService.getSessionUserId();
    const current = cachedSocials || { id: 'default', userId: uid || '' };

    const updated: SocialLinks = {
      ...current,
      ...partial,
      userId: uid || current.userId,
    };

    cachedSocials = updated;
    setStored(LOCAL_STORAGE_KEY_SOCIALS, updated);
    if (uid) {
      setStored(`${LOCAL_STORAGE_KEY_SOCIALS}_${uid}`, updated);
    }
    notifyListeners();

    if (isFirebaseConfigured && uid) {
      try {
        await setDoc(doc(db, 'users', uid, 'socials', 'default'), updated);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${uid}/socials/default`);
      }
    }

    return updated;
  }

  static updateSocials(partial: Partial<SocialLinks>): SocialLinks {
    const uid = AuthService.getSessionUserId();
    const current = cachedSocials || { id: 'default', userId: uid || '' };

    const updated: SocialLinks = {
      ...current,
      ...partial,
      userId: uid || current.userId,
    };

    cachedSocials = updated;
    setStored(LOCAL_STORAGE_KEY_SOCIALS, updated);
    if (uid) {
      setStored(`${LOCAL_STORAGE_KEY_SOCIALS}_${uid}`, updated);
    }
    notifyListeners();

    if (isFirebaseConfigured && uid) {
      setDoc(doc(db, 'users', uid, 'socials', 'default'), updated).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `users/${uid}/socials/default`);
      });
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
    if (!userId) return;

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
      setStored(LOCAL_STORAGE_KEY_ANALYTICS, cachedAnalytics);
      if (event === 'click' && meta?.linkId) {
        cachedLinks = cachedLinks.map((l) =>
          l.id === meta.linkId ? { ...l, clicks: (l.clicks || 0) + 1 } : l
        );
        setStored(LOCAL_STORAGE_KEY_LINKS, cachedLinks);
      }
      notifyListeners();
    }

    if (isFirebaseConfigured) {
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
}
