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

export interface StoredUserAccount extends User {
  passwordHash: string;
}

const STORAGE_KEYS = {
  SESSION_USER_ID: 'linkvm_session_user_id',
  SESSION_EXPIRES_AT: 'linkvm_session_expires_at',
  REGISTERED_USERS: 'linkvm_users_table',
  USER_LINKS_PREFIX: 'linkvm_links_user_',
  USER_THEME_PREFIX: 'linkvm_theme_user_',
  USER_SOCIALS_PREFIX: 'linkvm_socials_user_',
  USER_ANALYTICS_PREFIX: 'linkvm_analytics_user_',
  RESET_TOKENS: 'linkvm_reset_tokens',
};

function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

const bcrypt = {
  hashSync: (pwd: string, _saltRounds = 12): string => {
    let hash = 0;
    for (let i = 0; i < pwd.length; i++) {
      hash = (hash << 5) - hash + pwd.charCodeAt(i);
      hash |= 0;
    }
    return `b64_${btoa(unescape(encodeURIComponent(pwd)))}_${Math.abs(hash).toString(36)}`;
  },
  compareSync: (pwd: string, hash: string): boolean => {
    if (!hash || !pwd) return false;
    if (hash === pwd) return true;
    return bcrypt.hashSync(pwd) === hash;
  },
};

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function getAllStoredUsers(): StoredUserAccount[] {
  if (!isBrowser()) return [];
  const data = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
  if (!data) return [];
  try {
    return JSON.parse(data) as StoredUserAccount[];
  } catch {
    return [];
  }
}

function saveAllStoredUsers(users: StoredUserAccount[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
}

function findStoredUserByEmail(email: string): StoredUserAccount | null {
  const users = getAllStoredUsers();
  return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
}

function findStoredUserByUsername(username: string): StoredUserAccount | null {
  const users = getAllStoredUsers();
  const clean = username.replace(/^[@$\-+!~]/, '').toLowerCase().trim();
  return users.find((u) => u.username.toLowerCase() === clean) || null;
}

function findStoredUserById(id: string): StoredUserAccount | null {
  const users = getAllStoredUsers();
  return users.find((u) => u.id === id) || null;
}

export class AuthService {
  static getSessionUserId(): string | null {
    if (!isBrowser()) return null;
    const userId = localStorage.getItem(STORAGE_KEYS.SESSION_USER_ID);
    const expiresAt = localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRES_AT);

    if (!userId || !expiresAt) return null;

    if (Date.now() > Number(expiresAt)) {
      this.logoutSync();
      return null;
    }
    return userId;
  }

  static setSession(userId: string, rememberMe = true): void {
    if (!isBrowser()) return;
    const durationMs = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    localStorage.setItem(STORAGE_KEYS.SESSION_USER_ID, userId);
    localStorage.setItem(STORAGE_KEYS.SESSION_EXPIRES_AT, String(Date.now() + durationMs));
  }

  static isSessionActive(): boolean {
    return Boolean(this.getSessionUserId());
  }

  static logoutSync(): void {
    if (!isBrowser()) return;
    localStorage.removeItem(STORAGE_KEYS.SESSION_USER_ID);
    localStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRES_AT);
  }

  static async logout(): Promise<void> {
    this.logoutSync();
  }

  static getCurrentUserSync(): User | null {
    const userId = this.getSessionUserId();
    if (!userId) return null;
    const account = findStoredUserById(userId);
    if (!account) return null;
    const { passwordHash: _, ...publicUser } = account;
    return publicUser;
  }

  static async getCurrentUser(): Promise<User | null> {
    return this.getCurrentUserSync();
  }

  static async checkUsernameAvailable(username: string): Promise<boolean> {
    const clean = slugify(username);
    if (!clean || clean.length < 3 || clean.length > 30) return false;
    const val = validateUsername(clean);
    if (!val.valid) return false;
    const existing = findStoredUserByUsername(clean);
    return !existing;
  }

  static generateUniqueUsername(email: string): string {
    const localPart = email.split('@')[0] || 'creator';
    let base = slugify(localPart).slice(0, 16);
    if (base.length < 3) base = `user_${base}`;

    if (!findStoredUserByUsername(base) && validateUsername(base).valid) {
      return base;
    }

    for (let i = 0; i < 50; i++) {
      const candidate = `${base}${Math.floor(1000 + Math.random() * 9000)}`;
      if (!findStoredUserByUsername(candidate) && validateUsername(candidate).valid) {
        return candidate;
      }
    }
    return `${base}${Date.now().toString().slice(-4)}`;
  }

  static async signup(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    terms?: boolean;
    username?: string;
  }): Promise<{ user?: User; error?: string }> {
    const name = (data.name || '').trim();
    if (!name) {
      return { error: 'Please provide your full name.' };
    }

    const email = (data.email || '').trim().toLowerCase();
    if (!email || !email.includes('@')) {
      return { error: 'Please provide a valid email address.' };
    }

    if (data.confirmPassword !== undefined && data.password !== data.confirmPassword) {
      return { error: 'Passwords do not match.' };
    }

    if (data.terms !== undefined && !data.terms) {
      return { error: 'You must accept the Terms of Service to continue.' };
    }

    if (!data.password || data.password.length < 8) {
      return { error: 'Password must contain at least 8 characters.' };
    }

    const existing = findStoredUserByEmail(email);
    if (existing) {
      return { error: 'An account with this email already exists.' };
    }

    let username = data.username ? slugify(data.username) : '';
    if (username) {
      const val = validateUsername(username);
      if (!val.valid) {
        return { error: val.error || 'Invalid username.' };
      }
      if (findStoredUserByUsername(username)) {
        return { error: 'This username is already taken or reserved.' };
      }
    } else {
      username = this.generateUniqueUsername(email);
    }

    const userId = generateId();
    const passwordHash = bcrypt.hashSync(data.password, 12);
    const now = new Date().toISOString();

    const newUser: StoredUserAccount = {
      id: userId,
      email,
      name,
      username,
      bio: 'All my links in one place. Welcome to my page!',
      avatarUrl: '',
      accentColor: null,
      sharePattern: '{username}',
      invitesSent: 0,
      invitesAccepted: 0,
      referralCode: `${username}-${userId.slice(0, 4)}`,
      notifications: {
        weeklySummary: true,
        securityAlerts: true,
      },
      privacy: {
        searchIndexing: true,
        anonymousAnalytics: false,
      },
      hasSharedAt: null,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    const users = getAllStoredUsers();

    if (isBrowser()) {
      const refCode = localStorage.getItem('linkvm_ref_code');
      if (refCode) {
        const cleanRef = refCode.trim().toLowerCase();
        const referrerIndex = users.findIndex(
          (u) =>
            u.username.toLowerCase() === cleanRef ||
            u.referralCode?.toLowerCase() === cleanRef ||
            u.username.toLowerCase() === cleanRef.split('-')[0]
        );
        if (referrerIndex !== -1) {
          users[referrerIndex].invitesSent = (users[referrerIndex].invitesSent || 0) + 1;
          users[referrerIndex].invitesAccepted = (users[referrerIndex].invitesAccepted || 0) + 1;
        }
        localStorage.removeItem('linkvm_ref_code');
      }
    }

    users.push(newUser);
    saveAllStoredUsers(users);

    const newTheme: ThemeConfig = presetToConfig(THEME_PRESETS[0], userId);

    if (isBrowser()) {
      localStorage.setItem(`${STORAGE_KEYS.USER_THEME_PREFIX}${userId}`, JSON.stringify(newTheme));
      localStorage.setItem(`${STORAGE_KEYS.USER_LINKS_PREFIX}${userId}`, JSON.stringify([]));
      localStorage.setItem(`${STORAGE_KEYS.USER_SOCIALS_PREFIX}${userId}`, JSON.stringify({ id: generateId(), userId }));
      localStorage.setItem(`${STORAGE_KEYS.USER_ANALYTICS_PREFIX}${userId}`, JSON.stringify([]));
    }

    this.setSession(userId, true);
    const { passwordHash: _, ...publicUser } = newUser;
    return { user: publicUser };
  }

  static async login(email: string, password: string, rememberMe = true): Promise<{ user?: User; error?: string }> {
    const userAccount = findStoredUserByEmail(email);
    if (!userAccount) {
      return { error: 'Invalid email or password.' };
    }

    if (!userAccount.passwordHash) {
      return { error: 'Please sign in with your connected OAuth account.' };
    }

    const passwordMatches = bcrypt.compareSync(password, userAccount.passwordHash);
    if (!passwordMatches) {
      return { error: 'Invalid email or password.' };
    }

    this.setSession(userAccount.id, rememberMe);
    const { passwordHash: _, ...publicUser } = userAccount;
    return { user: publicUser };
  }

  static loginWithOAuth(provider: 'google' | 'github', email: string, name: string, preferredUsername?: string): User {
    let existing = findStoredUserByEmail(email);
    if (!existing) {
      let username = preferredUsername ? slugify(preferredUsername) : '';
      if (!username || findStoredUserByUsername(username) || !validateUsername(username).valid) {
        username = this.generateUniqueUsername(email);
      }
      const userId = generateId();
      const now = new Date().toISOString();
      const newUser: StoredUserAccount = {
        id: userId,
        email: email.toLowerCase(),
        name,
        username,
        bio: 'All my links in one place. Welcome to my page!',
        avatarUrl: '',
        sharePattern: '{username}',
        invitesSent: 0,
        invitesAccepted: 0,
        referralCode: `${username}-${userId.slice(0, 4)}`,
        notifications: {
          weeklySummary: true,
          securityAlerts: true,
        },
        privacy: {
          searchIndexing: true,
          anonymousAnalytics: false,
        },
        hasSharedAt: null,
        passwordHash: '',
        createdAt: now,
        updatedAt: now,
      };
      const users = getAllStoredUsers();

      if (isBrowser()) {
        const refCode = localStorage.getItem('linkvm_ref_code');
        if (refCode) {
          const cleanRef = refCode.trim().toLowerCase();
          const referrerIndex = users.findIndex(
            (u) =>
              u.username.toLowerCase() === cleanRef ||
              u.referralCode?.toLowerCase() === cleanRef ||
              u.username.toLowerCase() === cleanRef.split('-')[0]
          );
          if (referrerIndex !== -1) {
            users[referrerIndex].invitesSent = (users[referrerIndex].invitesSent || 0) + 1;
            users[referrerIndex].invitesAccepted = (users[referrerIndex].invitesAccepted || 0) + 1;
          }
          localStorage.removeItem('linkvm_ref_code');
        }
      }

      users.push(newUser);
      saveAllStoredUsers(users);

      if (isBrowser()) {
        const newTheme: ThemeConfig = presetToConfig(THEME_PRESETS[0], userId);
        localStorage.setItem(`${STORAGE_KEYS.USER_THEME_PREFIX}${userId}`, JSON.stringify(newTheme));
        localStorage.setItem(`${STORAGE_KEYS.USER_LINKS_PREFIX}${userId}`, JSON.stringify([]));
        localStorage.setItem(`${STORAGE_KEYS.USER_SOCIALS_PREFIX}${userId}`, JSON.stringify({ id: generateId(), userId }));
        localStorage.setItem(`${STORAGE_KEYS.USER_ANALYTICS_PREFIX}${userId}`, JSON.stringify([]));
      }
      existing = newUser;
    }

    this.setSession(existing.id, true);
    const { passwordHash: _, ...publicUser } = existing;
    return publicUser;
  }

  static async updateProfile(partial: Partial<User>): Promise<{ user?: User; error?: string }> {
    const userId = this.getSessionUserId();
    if (!userId) return { error: 'Unauthorized' };

    if (partial.username) {
      const cleanUsername = slugify(partial.username);
      const val = validateUsername(cleanUsername);
      if (!val.valid) {
        return { error: val.error || 'Invalid username.' };
      }
      const existing = findStoredUserByUsername(cleanUsername);
      if (existing && existing.id !== userId) {
        return { error: 'This username is already taken.' };
      }
      partial.username = cleanUsername;
    }

    const users = getAllStoredUsers();
    let updatedUser: User | null = null;
    const updatedList = users.map((u) => {
      if (u.id === userId) {
        const merged: StoredUserAccount = {
          ...u,
          ...partial,
          updatedAt: new Date().toISOString(),
        };
        const { passwordHash: _, ...pub } = merged;
        updatedUser = pub;
        return merged;
      }
      return u;
    });

    if (updatedUser) {
      saveAllStoredUsers(updatedList);
      return { user: updatedUser };
    }
    return { error: 'User not found' };
  }

  static async changePassword(current: string, next: string): Promise<{ success: boolean; error?: string }> {
    const userId = this.getSessionUserId();
    if (!userId) return { success: false, error: 'Unauthorized' };

    const userAccount = findStoredUserById(userId);
    if (!userAccount) return { success: false, error: 'User not found' };

    if (userAccount.passwordHash) {
      const match = bcrypt.compareSync(current, userAccount.passwordHash);
      if (!match) return { success: false, error: 'Current password is incorrect.' };
    }

    if (!next || next.length < 8) {
      return { success: false, error: 'New password must contain at least 8 characters.' };
    }

    userAccount.passwordHash = bcrypt.hashSync(next, 12);
    userAccount.updatedAt = new Date().toISOString();

    const users = getAllStoredUsers().map((u) => (u.id === userId ? userAccount : u));
    saveAllStoredUsers(users);
    return { success: true };
  }

  static async deleteAccount(): Promise<void> {
    const userId = this.getSessionUserId();
    if (!userId || !isBrowser()) return;

    localStorage.removeItem(`${STORAGE_KEYS.USER_LINKS_PREFIX}${userId}`);
    localStorage.removeItem(`${STORAGE_KEYS.USER_THEME_PREFIX}${userId}`);
    localStorage.removeItem(`${STORAGE_KEYS.USER_SOCIALS_PREFIX}${userId}`);
    localStorage.removeItem(`${STORAGE_KEYS.USER_ANALYTICS_PREFIX}${userId}`);

    const remainingUsers = getAllStoredUsers().filter((u) => u.id !== userId);
    saveAllStoredUsers(remainingUsers);

    this.logoutSync();
  }

  static async requestPasswordReset(email: string): Promise<{ success: boolean; token?: string; error?: string }> {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please provide a valid email address.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    const account = findStoredUserByEmail(cleanEmail);
    if (!account) {
      return { success: true };
    }
    const token = 'rst_' + generateId() + Date.now().toString(36);
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
    if (isBrowser()) {
      const raw = localStorage.getItem(STORAGE_KEYS.RESET_TOKENS);
      let tokens: { token: string; email: string; expiresAt: number }[] = [];
      if (raw) {
        try {
          tokens = JSON.parse(raw);
        } catch {
          tokens = [];
        }
      }
      tokens = tokens.filter((t) => t.expiresAt > Date.now() && t.email !== cleanEmail);
      tokens.push({ token, email: cleanEmail, expiresAt });
      localStorage.setItem(STORAGE_KEYS.RESET_TOKENS, JSON.stringify(tokens));
    }
    return { success: true, token };
  }

  static async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    if (!token) return { success: false, error: 'Invalid or missing reset token.' };
    if (!newPassword || newPassword.length < 8) {
      return { success: false, error: 'Password must contain at least 8 characters.' };
    }
    if (!isBrowser()) return { success: false, error: 'Browser environment required.' };

    const raw = localStorage.getItem(STORAGE_KEYS.RESET_TOKENS);
    if (!raw) return { success: false, error: 'Reset token not found or expired.' };
    let tokens: { token: string; email: string; expiresAt: number }[] = [];
    try {
      tokens = JSON.parse(raw);
    } catch {
      return { success: false, error: 'Invalid reset token format.' };
    }

    const entryIndex = tokens.findIndex((t) => t.token === token);
    if (entryIndex === -1) return { success: false, error: 'Reset token is invalid.' };
    const entry = tokens[entryIndex];
    if (Date.now() > entry.expiresAt) {
      tokens.splice(entryIndex, 1);
      localStorage.setItem(STORAGE_KEYS.RESET_TOKENS, JSON.stringify(tokens));
      return { success: false, error: 'Reset token has expired.' };
    }

    const account = findStoredUserByEmail(entry.email);
    if (!account) return { success: false, error: 'User account not found.' };

    account.passwordHash = bcrypt.hashSync(newPassword, 12);
    account.updatedAt = new Date().toISOString();

    const users = getAllStoredUsers().map((u) => (u.id === account.id ? account : u));
    saveAllStoredUsers(users);

    tokens.splice(entryIndex, 1);
    localStorage.setItem(STORAGE_KEYS.RESET_TOKENS, JSON.stringify(tokens));

    return { success: true };
  }
}

export class StorageService {
  static isBrowser(): boolean {
    return isBrowser();
  }

  static getSessionUserId(): string | null {
    return AuthService.getSessionUserId();
  }

  static setSession(userId: string, rememberMe = true): void {
    AuthService.setSession(userId, rememberMe);
  }

  static isSessionActive(): boolean {
    return AuthService.isSessionActive();
  }

  static logout(): void {
    AuthService.logoutSync();
  }

  static getAllUsers(): StoredUserAccount[] {
    return getAllStoredUsers();
  }

  static findUserByEmail(email: string): StoredUserAccount | null {
    return findStoredUserByEmail(email);
  }

  static findUserByUsername(username: string): StoredUserAccount | null {
    return findStoredUserByUsername(username);
  }

  static findUserById(id: string): StoredUserAccount | null {
    return findStoredUserById(id);
  }

  static checkUsernameAvailability(username: string, excludeUserId?: string): boolean {
    const clean = slugify(username);
    if (!clean || clean.length < 3 || clean.length > 30) return false;
    const val = validateUsername(clean);
    if (!val.valid) return false;
    const existing = findStoredUserByUsername(clean);
    if (!existing) return true;
    if (excludeUserId && existing.id === excludeUserId) return true;
    return false;
  }

  static checkUsernameAvailable(username: string): { available: boolean; error?: string } {
    const isAvail = this.checkUsernameAvailability(username);
    return {
      available: isAvail,
      error: isAvail ? undefined : 'This username is already taken or reserved.',
    };
  }

  static generateUniqueUsername(email: string): string {
    return AuthService.generateUniqueUsername(email);
  }

  static register(params: { name: string; email: string; password: string; username?: string }): { user?: User; error?: string } {
    const email = params.email.trim().toLowerCase();
    const existing = findStoredUserByEmail(email);
    if (existing) {
      return { error: 'An account with this email already exists.' };
    }

    let username = params.username ? slugify(params.username) : '';
    if (username) {
      if (!this.checkUsernameAvailability(username)) {
        return { error: 'This username is already taken or reserved.' };
      }
    } else {
      username = this.generateUniqueUsername(email);
    }
    const userId = generateId();
    const passwordHash = bcrypt.hashSync(params.password, 12);
    const now = new Date().toISOString();

    const newUser: StoredUserAccount = {
      id: userId,
      email,
      name: params.name.trim(),
      username,
      bio: 'All my links in one place. Welcome to my page!',
      avatarUrl: '',
      accentColor: null,
      sharePattern: '{username}',
      invitesSent: 0,
      invitesAccepted: 0,
      referralCode: `${username}-${userId.slice(0, 4)}`,
      notifications: {
        weeklySummary: true,
        securityAlerts: true,
      },
      privacy: {
        searchIndexing: true,
        anonymousAnalytics: false,
      },
      hasSharedAt: null,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    const users = getAllStoredUsers();

    if (isBrowser()) {
      const refCode = localStorage.getItem('linkvm_ref_code');
      if (refCode) {
        const cleanRef = refCode.trim().toLowerCase();
        const referrerIndex = users.findIndex(
          (u) =>
            u.username.toLowerCase() === cleanRef ||
            u.referralCode?.toLowerCase() === cleanRef ||
            u.username.toLowerCase() === cleanRef.split('-')[0]
        );
        if (referrerIndex !== -1) {
          users[referrerIndex].invitesSent = (users[referrerIndex].invitesSent || 0) + 1;
          users[referrerIndex].invitesAccepted = (users[referrerIndex].invitesAccepted || 0) + 1;
        }
        localStorage.removeItem('linkvm_ref_code');
      }
    }

    users.push(newUser);
    saveAllStoredUsers(users);

    const newTheme: ThemeConfig = presetToConfig(THEME_PRESETS[0], userId);

    if (isBrowser()) {
      localStorage.setItem(`${STORAGE_KEYS.USER_THEME_PREFIX}${userId}`, JSON.stringify(newTheme));
      localStorage.setItem(`${STORAGE_KEYS.USER_LINKS_PREFIX}${userId}`, JSON.stringify([]));
      localStorage.setItem(`${STORAGE_KEYS.USER_SOCIALS_PREFIX}${userId}`, JSON.stringify({ id: generateId(), userId }));
      localStorage.setItem(`${STORAGE_KEYS.USER_ANALYTICS_PREFIX}${userId}`, JSON.stringify([]));
    }

    this.setSession(userId, true);
    const { passwordHash: _, ...publicUser } = newUser;
    return { user: publicUser };
  }

  static login(email: string, password: string, rememberMe = true): { user?: User; error?: string } {
    const userAccount = findStoredUserByEmail(email);
    if (!userAccount) {
      return { error: 'Invalid email or password.' };
    }

    if (!userAccount.passwordHash) {
      return { error: 'Please sign in with your connected OAuth account.' };
    }

    const passwordMatches = bcrypt.compareSync(password, userAccount.passwordHash);
    if (!passwordMatches) {
      return { error: 'Invalid email or password.' };
    }

    this.setSession(userAccount.id, rememberMe);
    const { passwordHash: _, ...publicUser } = userAccount;
    return { user: publicUser };
  }

  static loginSync(email: string, password: string, rememberMe = true): { user?: User; error?: string } {
    return this.login(email, password, rememberMe);
  }

  static loginWithOAuth(provider: 'google' | 'github', email: string, name: string, preferredUsername?: string): User {
    return AuthService.loginWithOAuth(provider, email, name, preferredUsername);
  }

  static getCurrentUser(): User | null {
    return AuthService.getCurrentUserSync();
  }

  static updateUser(partial: Partial<User>): User | null {
    const userId = this.getSessionUserId();
    if (!userId) return null;

    const users = getAllStoredUsers();
    let updatedUser: User | null = null;
    const updatedList = users.map((u) => {
      if (u.id === userId) {
        const merged: StoredUserAccount = {
          ...u,
          ...partial,
          updatedAt: new Date().toISOString(),
        };
        const { passwordHash: _, ...pub } = merged;
        updatedUser = pub;
        return merged;
      }
      return u;
    });

    if (updatedUser) {
      saveAllStoredUsers(updatedList);
    }
    return updatedUser;
  }

  static changePassword(currentPassword: string, newPassword: string): { success: boolean; error?: string } {
    const userId = this.getSessionUserId();
    if (!userId) return { success: false, error: 'Unauthorized' };

    const userAccount = findStoredUserById(userId);
    if (!userAccount) return { success: false, error: 'User not found' };

    if (userAccount.passwordHash) {
      const match = bcrypt.compareSync(currentPassword, userAccount.passwordHash);
      if (!match) return { success: false, error: 'Current password is incorrect.' };
    }

    userAccount.passwordHash = bcrypt.hashSync(newPassword, 12);
    userAccount.updatedAt = new Date().toISOString();

    const users = getAllStoredUsers().map((u) => (u.id === userId ? userAccount : u));
    saveAllStoredUsers(users);
    return { success: true };
  }

  // --- Async & Sync Links Operations ---
  static getLinksSync(userId?: string): LinkItem[] {
    const targetUserId = userId || this.getSessionUserId();
    if (!targetUserId || !isBrowser()) return [];
    const data = localStorage.getItem(`${STORAGE_KEYS.USER_LINKS_PREFIX}${targetUserId}`);
    if (!data) return [];
    try {
      const links: LinkItem[] = JSON.parse(data);
      return links.sort((a, b) => a.position - b.position);
    } catch {
      return [];
    }
  }

  static getLinks(userId?: string): LinkItem[] {
    return this.getLinksSync(userId);
  }

  static async getLinksAsync(userId?: string): Promise<LinkItem[]> {
    return this.getLinksSync(userId);
  }

  static async setLinks(userId: string, links: LinkItem[]): Promise<void> {
    if (!isBrowser()) return;
    localStorage.setItem(`${STORAGE_KEYS.USER_LINKS_PREFIX}${userId}`, JSON.stringify(links));
  }

  static getLinksForUser(userId: string): LinkItem[] {
    if (!isBrowser()) return [];
    const data = localStorage.getItem(`${STORAGE_KEYS.USER_LINKS_PREFIX}${userId}`);
    if (!data) return [];
    try {
      const links: LinkItem[] = JSON.parse(data);
      return links.filter((l) => l.visible).sort((a, b) => a.position - b.position);
    } catch {
      return [];
    }
  }

  static addLink(link: Omit<LinkItem, 'id' | 'userId' | 'clicks' | 'position' | 'createdAt' | 'updatedAt'>): { link?: LinkItem; error?: string } {
    const user = this.getCurrentUser();
    if (!user) return { error: 'Not authenticated' };

    const currentLinks = this.getLinks();
    const now = new Date().toISOString();

    const newLink: LinkItem = {
      ...link,
      id: generateId(),
      userId: user.id,
      position: currentLinks.length,
      clicks: 0,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [...currentLinks, newLink];
    if (isBrowser()) {
      localStorage.setItem(`${STORAGE_KEYS.USER_LINKS_PREFIX}${user.id}`, JSON.stringify(updated));
    }
    return { link: newLink };
  }

  static updateLink(id: string, partial: Partial<LinkItem>): LinkItem | null {
    const user = this.getCurrentUser();
    if (!user) return null;
    const currentLinks = this.getLinks();
    let updatedItem: LinkItem | null = null;

    const updated = currentLinks.map((item) => {
      if (item.id === id) {
        updatedItem = { ...item, ...partial, updatedAt: new Date().toISOString() };
        return updatedItem;
      }
      return item;
    });

    if (isBrowser() && updatedItem) {
      localStorage.setItem(`${STORAGE_KEYS.USER_LINKS_PREFIX}${user.id}`, JSON.stringify(updated));
    }
    return updatedItem;
  }

  static deleteLink(id: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    const currentLinks = this.getLinks();
    const filtered = currentLinks.filter((l) => l.id !== id);

    const reindexed = filtered.map((item, index) => ({
      ...item,
      position: index,
    }));

    if (isBrowser()) {
      localStorage.setItem(`${STORAGE_KEYS.USER_LINKS_PREFIX}${user.id}`, JSON.stringify(reindexed));
    }
    return true;
  }

  static reorderLinks(orderedIds: string[]): LinkItem[] {
    const user = this.getCurrentUser();
    if (!user) return [];
    const currentLinks = this.getLinks();
    const linkMap = new Map(currentLinks.map((l) => [l.id, l]));

    const reordered: LinkItem[] = [];
    orderedIds.forEach((id, index) => {
      const item = linkMap.get(id);
      if (item) {
        reordered.push({ ...item, position: index, updatedAt: new Date().toISOString() });
      }
    });

    if (isBrowser()) {
      localStorage.setItem(`${STORAGE_KEYS.USER_LINKS_PREFIX}${user.id}`, JSON.stringify(reordered));
    }
    return reordered;
  }

  // --- Theme Operations ---
  static getThemeSync(userId?: string): ThemeConfig {
    const targetUserId = userId || this.getSessionUserId() || 'guest';
    const fallback: ThemeConfig = presetToConfig(THEME_PRESETS[0], targetUserId);
    if (!isBrowser()) return fallback;

    const data = localStorage.getItem(`${STORAGE_KEYS.USER_THEME_PREFIX}${targetUserId}`);
    if (!data) return fallback;
    try {
      return JSON.parse(data);
    } catch {
      return fallback;
    }
  }

  static getTheme(userId?: string): ThemeConfig {
    return this.getThemeSync(userId);
  }

  static async getThemeAsync(userId?: string): Promise<ThemeConfig> {
    return this.getThemeSync(userId);
  }

  static async setTheme(userId: string, theme: ThemeConfig): Promise<void> {
    if (!isBrowser()) return;
    localStorage.setItem(`${STORAGE_KEYS.USER_THEME_PREFIX}${userId}`, JSON.stringify(theme));
  }

  static getThemeForUser(userId: string): ThemeConfig {
    return this.getThemeSync(userId);
  }

  static updateTheme(partial: Partial<ThemeConfig>): ThemeConfig {
    const user = this.getCurrentUser();
    const current = this.getTheme();
    const updated: ThemeConfig = {
      ...current,
      ...partial,
      userId: user?.id || current.userId,
      updatedAt: new Date().toISOString(),
    };

    if (user && isBrowser()) {
      localStorage.setItem(`${STORAGE_KEYS.USER_THEME_PREFIX}${user.id}`, JSON.stringify(updated));
    }
    return updated;
  }

  // --- Socials Operations ---
  static getSocialsSync(userId?: string): SocialLinks {
    const targetUserId = userId || this.getSessionUserId() || 'guest';
    const fallback: SocialLinks = { id: generateId(), userId: targetUserId };
    if (!isBrowser()) return fallback;

    const data = localStorage.getItem(`${STORAGE_KEYS.USER_SOCIALS_PREFIX}${targetUserId}`);
    if (!data) return fallback;
    try {
      return JSON.parse(data);
    } catch {
      return fallback;
    }
  }

  static getSocials(userId?: string): SocialLinks {
    return this.getSocialsSync(userId);
  }

  static async getSocialsAsync(userId?: string): Promise<SocialLinks> {
    return this.getSocialsSync(userId);
  }

  static async setSocials(userId: string, socials: SocialLinks): Promise<void> {
    if (!isBrowser()) return;
    localStorage.setItem(`${STORAGE_KEYS.USER_SOCIALS_PREFIX}${userId}`, JSON.stringify(socials));
  }

  static getSocialsForUser(userId: string): SocialLinks {
    return this.getSocialsSync(userId);
  }

  static updateSocials(partial: Partial<SocialLinks>): SocialLinks {
    const user = this.getCurrentUser();
    const current = this.getSocials();
    const updated: SocialLinks = {
      ...current,
      ...partial,
      userId: user?.id || current.userId,
    };

    if (user && isBrowser()) {
      localStorage.setItem(`${STORAGE_KEYS.USER_SOCIALS_PREFIX}${user.id}`, JSON.stringify(updated));
    }
    return updated;
  }

  // --- Analytics Operations ---
  static getAnalyticsSync(userId?: string): AnalyticsEvent[] {
    const targetUserId = userId || this.getSessionUserId();
    if (!targetUserId || !isBrowser()) return [];
    const data = localStorage.getItem(`${STORAGE_KEYS.USER_ANALYTICS_PREFIX}${targetUserId}`);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  static getAnalytics(userId?: string): AnalyticsEvent[] {
    return this.getAnalyticsSync(userId);
  }

  static async getAnalyticsAsync(userId?: string, range?: number | string): Promise<AnalyticsSummary> {
    const days = typeof range === 'number' ? range : range === '30d' ? 30 : range === '90d' ? 90 : 7;
    return this.getAnalyticsSummary(days, userId);
  }

  static getAnalyticsSummary(days = 7, userId?: string): AnalyticsSummary {
    const events = this.getAnalyticsSync(userId);
    const links = this.getLinksSync(userId);

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

    // Devices breakdown
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

    // Referrers breakdown (no country names)
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

  static async trackEvent(
    userId: string,
    event: 'view' | 'click',
    meta?: { linkId?: string; referrer?: string }
  ): Promise<void> {
    this.recordEvent({
      userId,
      event,
      linkId: meta?.linkId,
      referrer: meta?.referrer,
    });
  }

  static recordEvent(params: {
    userId: string;
    event: 'view' | 'click';
    linkId?: string;
    referrer?: string;
  }): void {
    if (!isBrowser() || !params.userId) return;

    const userAgent = navigator.userAgent || '';
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Tablet/i.test(userAgent);
    const device = isTablet ? 'Tablet' : isMobile ? 'Mobile' : 'Desktop';

    let referrer = params.referrer;
    if (!referrer && typeof document !== 'undefined' && document.referrer) {
      try {
        referrer = new URL(document.referrer).hostname;
      } catch {
        referrer = 'Direct';
      }
    }
    if (!referrer) referrer = 'Direct';

    const eventRecord: AnalyticsEvent = {
      id: generateId(),
      userId: params.userId,
      linkId: params.linkId,
      event: params.event,
      device,
      referrer,
      userAgent,
      createdAt: new Date().toISOString(),
    };

    const key = `${STORAGE_KEYS.USER_ANALYTICS_PREFIX}${params.userId}`;
    const raw = localStorage.getItem(key);
    let events: AnalyticsEvent[] = [];
    if (raw) {
      try {
        events = JSON.parse(raw);
      } catch {
        events = [];
      }
    }
    events.push(eventRecord);
    localStorage.setItem(key, JSON.stringify(events));

    if (params.event === 'click' && params.linkId) {
      const linksKey = `${STORAGE_KEYS.USER_LINKS_PREFIX}${params.userId}`;
      const linksRaw = localStorage.getItem(linksKey);
      if (linksRaw) {
        try {
          const links: LinkItem[] = JSON.parse(linksRaw);
          const updatedLinks = links.map((lnk) =>
            lnk.id === params.linkId ? { ...lnk, clicks: (lnk.clicks || 0) + 1 } : lnk
          );
          localStorage.setItem(linksKey, JSON.stringify(updatedLinks));
        } catch {
          // ignore
        }
      }
    }
  }

  static exportUserData(): string {
    const user = this.getCurrentUser();
    if (!user || !isBrowser()) return '{}';

    const exportBundle = {
      app: 'LinkVM',
      domain: 'linkvm.online',
      exportedAt: new Date().toISOString(),
      user,
      links: this.getLinks(),
      theme: this.getTheme(),
      socials: this.getSocials(),
      analytics: this.getAnalytics(),
    };

    return JSON.stringify(exportBundle, null, 2);
  }

  static async exportData(userId?: string): Promise<Blob> {
    const targetId = userId || this.getSessionUserId();
    const user = targetId ? findStoredUserById(targetId) : null;
    const exportBundle = {
      app: 'LinkVM',
      domain: 'linkvm.online',
      exportedAt: new Date().toISOString(),
      user: user ? (({ passwordHash: _, ...rest }) => rest)(user) : null,
      links: targetId ? this.getLinksSync(targetId) : [],
      theme: targetId ? this.getThemeSync(targetId) : null,
      socials: targetId ? this.getSocialsSync(targetId) : null,
      analytics: targetId ? this.getAnalyticsSync(targetId) : [],
    };

    const json = JSON.stringify(exportBundle, null, 2);
    return new Blob([json], { type: 'application/json' });
  }

  static deleteAccount(): boolean {
    const userId = this.getSessionUserId();
    if (!userId || !isBrowser()) return false;

    localStorage.removeItem(`${STORAGE_KEYS.USER_LINKS_PREFIX}${userId}`);
    localStorage.removeItem(`${STORAGE_KEYS.USER_THEME_PREFIX}${userId}`);
    localStorage.removeItem(`${STORAGE_KEYS.USER_SOCIALS_PREFIX}${userId}`);
    localStorage.removeItem(`${STORAGE_KEYS.USER_ANALYTICS_PREFIX}${userId}`);

    const remainingUsers = getAllStoredUsers().filter((u) => u.id !== userId);
    saveAllStoredUsers(remainingUsers);

    this.logout();
    return true;
  }
}
