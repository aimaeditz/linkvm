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
import { isReservedUsername, validateUsername } from './reserved-usernames';

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
};

// Pure, client-safe SHA-256 implementation
function sha256Sync(ascii: string): string {
  function rightRotate(value: number, amount: number): number {
    return (value >>> amount) | (value << (32 - amount));
  }

  const maxWord = Math.pow(2, 32);
  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;

  const hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;

  const isComposite: Record<number, boolean> = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (let i = 0; i < 313; i += candidate) {
        isComposite[i] = true;
      }
      hash[primeCounter] = (Math.pow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (Math.pow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  let formatted = ascii + '\x80';
  while ((formatted.length % 64) !== 56) {
    formatted += '\x00';
  }
  for (let i = 0; i < formatted.length; i++) {
    const j = formatted.charCodeAt(i);
    words[i >> 2] = (words[i >> 2] || 0) | (j << (((3 - i) % 4) * 8));
  }
  words.push((asciiBitLength / maxWord) | 0);
  words.push(asciiBitLength);

  for (let j = 0; j < words.length; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = [...hash];

    for (let i = 0; i < 64; i++) {
      const w15 = w[i - 15] || 0;
      const w2 = w[i - 2] || 0;

      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      w[i] =
        i < 16
          ? (w[i] || 0)
          : (((w[i - 16] || 0) + s0 + (w[i - 7] || 0) + s1) | 0);

      const s1h = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const temp1 = (hash[7] + s1h + ch + k[i] + w[i]) | 0;
      const s0h = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp2 = (s0h + maj) | 0;

      hash[7] = hash[6];
      hash[6] = hash[5];
      hash[5] = hash[4];
      hash[4] = (hash[3] + temp1) | 0;
      hash[3] = hash[2];
      hash[2] = hash[1];
      hash[1] = hash[0];
      hash[0] = (temp1 + temp2) | 0;
    }

    for (let i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  let result = '';
  for (let i = 0; i < 8; i++) {
    for (let b = 3; b >= 0; b--) {
      const byte = (hash[i] >> (b * 8)) & 255;
      result += (byte < 16 ? '0' : '') + byte.toString(16);
    }
  }
  return result;
}

export function hashClientPassword(password: string): string {
  const salt = 'linkvm_secure_client_salt_v2';
  return sha256Sync(`${salt}:${password}`);
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

export class StorageService {
  static isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // --- Session Management ---
  static getSessionUserId(): string | null {
    if (!this.isBrowser()) return null;
    const userId = localStorage.getItem(STORAGE_KEYS.SESSION_USER_ID);
    const expiresAt = localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRES_AT);

    if (!userId || !expiresAt) return null;

    if (Date.now() > Number(expiresAt)) {
      this.logout();
      return null;
    }
    return userId;
  }

  static setSession(userId: string, rememberMe = true): void {
    if (!this.isBrowser()) return;
    const durationMs = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    localStorage.setItem(STORAGE_KEYS.SESSION_USER_ID, userId);
    localStorage.setItem(STORAGE_KEYS.SESSION_EXPIRES_AT, String(Date.now() + durationMs));
  }

  static isSessionActive(): boolean {
    return Boolean(this.getSessionUserId());
  }

  static logout(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(STORAGE_KEYS.SESSION_USER_ID);
    localStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRES_AT);
  }

  // --- Users DB ---
  static getAllUsers(): StoredUserAccount[] {
    if (!this.isBrowser()) return [];
    const data = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private static saveAllUsers(users: StoredUserAccount[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
  }

  static findUserByEmail(email: string): StoredUserAccount | null {
    const users = this.getAllUsers();
    return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
  }

  static findUserByUsername(username: string): StoredUserAccount | null {
    const users = this.getAllUsers();
    const clean = username.replace(/^[@$\-+!~]/, '').toLowerCase().trim();
    return users.find((u) => u.username.toLowerCase() === clean) || null;
  }

  static findUserById(id: string): StoredUserAccount | null {
    const users = this.getAllUsers();
    return users.find((u) => u.id === id) || null;
  }

  static checkUsernameAvailable(username: string, excludeUserId?: string): { available: boolean; error?: string } {
    const clean = username.replace(/^[@$\-+!~]/, '').toLowerCase().trim();
    const validation = validateUsername(clean);
    if (!validation.valid) {
      return { available: false, error: validation.error || 'Invalid username.' };
    }

    if (isReservedUsername(clean)) {
      return { available: false, error: 'This username is reserved.' };
    }

    const existing = this.findUserByUsername(clean);
    if (!existing || (excludeUserId && existing.id === excludeUserId)) {
      return { available: true };
    }

    return { available: false, error: 'This username is already taken.' };
  }

  static checkUsernameAvailability(username: string, excludeUserId?: string): boolean {
    return this.checkUsernameAvailable(username, excludeUserId).available;
  }

  static generateUniqueUsername(email: string, preferred?: string): string {
    let base = preferred ? slugify(preferred) : slugify(email.split('@')[0] || 'creator');
    base = base.replace(/^[-_]+|[-_]+$/g, '').slice(0, 16);
    if (base.length < 3) base = `user_${base}`;
    if (isReservedUsername(base)) base = `${base}_page`;

    if (this.checkUsernameAvailability(base)) {
      return base;
    }

    for (let i = 0; i < 50; i++) {
      const candidate = `${base}${Math.floor(1000 + Math.random() * 9000)}`;
      if (this.checkUsernameAvailability(candidate)) {
        return candidate;
      }
    }
    return `${base}${Date.now().toString().slice(-4)}`;
  }

  // --- Register / Signup & Login ---
  static async signup(params: {
    name: string;
    email: string;
    password: string;
    username?: string;
  }): Promise<{ user?: User; error?: string }> {
    return this.register(params);
  }

  static register(params: {
    name: string;
    email: string;
    password: string;
    username?: string;
  }): { user?: User; error?: string } {
    const email = params.email.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      return { error: 'Please enter a valid email address.' };
    }

    if (!params.password || params.password.length < 6) {
      return { error: 'Password must be at least 6 characters long.' };
    }

    const existing = this.findUserByEmail(email);
    if (existing) {
      return { error: 'An account with this email already exists.' };
    }

    let username = '';
    if (params.username && params.username.trim()) {
      const check = this.checkUsernameAvailable(params.username);
      if (!check.available) {
        return { error: check.error || 'Username is not available.' };
      }
      username = params.username.trim().toLowerCase();
    } else {
      username = this.generateUniqueUsername(email, params.name);
    }

    const userId = generateId();
    const passwordHash = hashClientPassword(params.password);
    const now = new Date().toISOString();

    const newUser: StoredUserAccount = {
      id: userId,
      email,
      name: params.name ? params.name.trim() : 'Creator',
      username,
      bio: 'All my links in one place. Welcome to my page!',
      avatarUrl: '',
      accentColor: null,
      sharePattern: '{username}',
      invitesSent: 0,
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

    const users = this.getAllUsers();

    if (this.isBrowser()) {
      const refCode = localStorage.getItem('linkvm_ref_code');
      if (refCode) {
        const referrerIndex = users.findIndex(
          (u) => u.username.toLowerCase() === refCode.toLowerCase()
        );
        if (referrerIndex !== -1) {
          users[referrerIndex].invitesSent = (users[referrerIndex].invitesSent || 0) + 1;
        }
        localStorage.removeItem('linkvm_ref_code');
      }
    }

    users.push(newUser);
    this.saveAllUsers(users);

    const newTheme: ThemeConfig = presetToConfig(THEME_PRESETS[0], userId);

    if (this.isBrowser()) {
      localStorage.setItem(`${STORAGE_KEYS.USER_THEME_PREFIX}${userId}`, JSON.stringify(newTheme));
      localStorage.setItem(`${STORAGE_KEYS.USER_LINKS_PREFIX}${userId}`, JSON.stringify([]));
      localStorage.setItem(
        `${STORAGE_KEYS.USER_SOCIALS_PREFIX}${userId}`,
        JSON.stringify({ id: generateId(), userId })
      );
      localStorage.setItem(`${STORAGE_KEYS.USER_ANALYTICS_PREFIX}${userId}`, JSON.stringify([]));
    }

    this.setSession(userId, true);
    const { passwordHash: _, ...publicUser } = newUser;
    return { user: publicUser };
  }

  static async login(
    email: string,
    password: string,
    rememberMe = true
  ): Promise<{ user?: User; error?: string }> {
    return this.loginSync(email, password, rememberMe);
  }

  static loginSync(
    email: string,
    password: string,
    rememberMe = true
  ): { user?: User; error?: string } {
    const userAccount = this.findUserByEmail(email);
    if (!userAccount) {
      return { error: 'Invalid email or password.' };
    }

    if (!userAccount.passwordHash) {
      return { error: 'Please sign in with your connected OAuth account.' };
    }

    const inputHash = hashClientPassword(password);
    if (inputHash !== userAccount.passwordHash) {
      return { error: 'Invalid email or password.' };
    }

    this.setSession(userAccount.id, rememberMe);
    const { passwordHash: _, ...publicUser } = userAccount;
    return { user: publicUser };
  }

  static loginWithOAuth(provider: 'google' | 'github', email: string, name: string): User {
    let existing = this.findUserByEmail(email);
    if (!existing) {
      const username = this.generateUniqueUsername(email, name);
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
      const users = this.getAllUsers();
      users.push(newUser);
      this.saveAllUsers(users);

      if (this.isBrowser()) {
        const newTheme: ThemeConfig = presetToConfig(THEME_PRESETS[0], userId);
        localStorage.setItem(`${STORAGE_KEYS.USER_THEME_PREFIX}${userId}`, JSON.stringify(newTheme));
        localStorage.setItem(`${STORAGE_KEYS.USER_LINKS_PREFIX}${userId}`, JSON.stringify([]));
        localStorage.setItem(
          `${STORAGE_KEYS.USER_SOCIALS_PREFIX}${userId}`,
          JSON.stringify({ id: generateId(), userId })
        );
        localStorage.setItem(`${STORAGE_KEYS.USER_ANALYTICS_PREFIX}${userId}`, JSON.stringify([]));
      }
      existing = newUser;
    }

    this.setSession(existing.id, true);
    const { passwordHash: _, ...publicUser } = existing;
    return publicUser;
  }

  // --- Current User Operations ---
  static getCurrentUser(): User | null {
    const userId = this.getSessionUserId();
    if (!userId) return null;
    const account = this.findUserById(userId);
    if (!account) return null;
    const { passwordHash: _, ...publicUser } = account;
    return publicUser;
  }

  static updateUser(partial: Partial<User>): User | null {
    const userId = this.getSessionUserId();
    if (!userId) return null;

    const users = this.getAllUsers();
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
      this.saveAllUsers(updatedList);
    }
    return updatedUser;
  }

  static async updateProfile(partial: Partial<User>): Promise<User | null> {
    return this.updateUser(partial);
  }

  static changePassword(
    currentPassword: string,
    newPassword: string
  ): { success: boolean; error?: string } {
    const userId = this.getSessionUserId();
    if (!userId) return { success: false, error: 'Unauthorized' };

    const userAccount = this.findUserById(userId);
    if (!userAccount) return { success: false, error: 'User not found' };

    if (userAccount.passwordHash) {
      const match = hashClientPassword(currentPassword) === userAccount.passwordHash;
      if (!match) return { success: false, error: 'Current password is incorrect.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }

    userAccount.passwordHash = hashClientPassword(newPassword);
    userAccount.updatedAt = new Date().toISOString();

    const users = this.getAllUsers().map((u) => (u.id === userId ? userAccount : u));
    this.saveAllUsers(users);
    return { success: true };
  }

  // --- Links Operations ---
  static getLinks(): LinkItem[] {
    const userId = this.getSessionUserId();
    if (!userId || !this.isBrowser()) return [];
    const data = localStorage.getItem(`${STORAGE_KEYS.USER_LINKS_PREFIX}${userId}`);
    if (!data) return [];
    try {
      const links: LinkItem[] = JSON.parse(data);
      return links.sort((a, b) => a.position - b.position);
    } catch {
      return [];
    }
  }

  static setLinks(links: LinkItem[]): void {
    const user = this.getCurrentUser();
    if (!user || !this.isBrowser()) return;
    localStorage.setItem(`${STORAGE_KEYS.USER_LINKS_PREFIX}${user.id}`, JSON.stringify(links));
  }

  static getLinksForUser(userId: string): LinkItem[] {
    if (!this.isBrowser()) return [];
    const data = localStorage.getItem(`${STORAGE_KEYS.USER_LINKS_PREFIX}${userId}`);
    if (!data) return [];
    try {
      const links: LinkItem[] = JSON.parse(data);
      return links.filter((l) => l.visible).sort((a, b) => a.position - b.position);
    } catch {
      return [];
    }
  }

  static addLink(
    link: Omit<LinkItem, 'id' | 'userId' | 'clicks' | 'position' | 'createdAt' | 'updatedAt'>
  ): { link?: LinkItem; error?: string } {
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
    this.setLinks(updated);
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

    if (updatedItem) {
      this.setLinks(updated);
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

    this.setLinks(reindexed);
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

    this.setLinks(reordered);
    return reordered;
  }

  // --- Theme Operations ---
  static getTheme(): ThemeConfig {
    const user = this.getCurrentUser();
    const fallback: ThemeConfig = presetToConfig(THEME_PRESETS[0], user?.id || 'guest');
    if (!user || !this.isBrowser()) return fallback;

    const data = localStorage.getItem(`${STORAGE_KEYS.USER_THEME_PREFIX}${user.id}`);
    if (!data) return fallback;
    try {
      return JSON.parse(data);
    } catch {
      return fallback;
    }
  }

  static setTheme(theme: ThemeConfig): void {
    const user = this.getCurrentUser();
    if (!user || !this.isBrowser()) return;
    localStorage.setItem(`${STORAGE_KEYS.USER_THEME_PREFIX}${user.id}`, JSON.stringify(theme));
  }

  static getThemeForUser(userId: string): ThemeConfig {
    const fallback: ThemeConfig = presetToConfig(THEME_PRESETS[0], userId);
    if (!this.isBrowser()) return fallback;
    const data = localStorage.getItem(`${STORAGE_KEYS.USER_THEME_PREFIX}${userId}`);
    if (!data) return fallback;
    try {
      return JSON.parse(data);
    } catch {
      return fallback;
    }
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

    if (user && this.isBrowser()) {
      this.setTheme(updated);
    }
    return updated;
  }

  // --- Socials Operations ---
  static getSocials(): SocialLinks {
    const user = this.getCurrentUser();
    const fallback: SocialLinks = { id: generateId(), userId: user?.id || 'guest' };
    if (!user || !this.isBrowser()) return fallback;

    const data = localStorage.getItem(`${STORAGE_KEYS.USER_SOCIALS_PREFIX}${user.id}`);
    if (!data) return fallback;
    try {
      return JSON.parse(data);
    } catch {
      return fallback;
    }
  }

  static setSocials(socials: SocialLinks): void {
    const user = this.getCurrentUser();
    if (!user || !this.isBrowser()) return;
    localStorage.setItem(`${STORAGE_KEYS.USER_SOCIALS_PREFIX}${user.id}`, JSON.stringify(socials));
  }

  static getSocialsForUser(userId: string): SocialLinks {
    const fallback: SocialLinks = { id: generateId(), userId };
    if (!this.isBrowser()) return fallback;
    const data = localStorage.getItem(`${STORAGE_KEYS.USER_SOCIALS_PREFIX}${userId}`);
    if (!data) return fallback;
    try {
      return JSON.parse(data);
    } catch {
      return fallback;
    }
  }

  static updateSocials(partial: Partial<SocialLinks>): SocialLinks {
    const user = this.getCurrentUser();
    const current = this.getSocials();
    const updated: SocialLinks = {
      ...current,
      ...partial,
      userId: user?.id || current.userId,
    };

    if (user && this.isBrowser()) {
      this.setSocials(updated);
    }
    return updated;
  }

  // --- Analytics Operations ---
  static getAnalytics(): AnalyticsEvent[] {
    const user = this.getCurrentUser();
    if (!user || !this.isBrowser()) return [];
    const data = localStorage.getItem(`${STORAGE_KEYS.USER_ANALYTICS_PREFIX}${user.id}`);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  static getAnalyticsSummary(days = 7): AnalyticsSummary {
    const events = this.getAnalytics();
    const links = this.getLinks();

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

  static trackEvent(params: {
    userId: string;
    event: 'view' | 'click';
    linkId?: string;
    referrer?: string;
  }): void {
    this.recordEvent(params);
  }

  static recordEvent(params: {
    userId: string;
    event: 'view' | 'click';
    linkId?: string;
    referrer?: string;
  }): void {
    if (!this.isBrowser() || !params.userId) return;

    const userAgent = navigator.userAgent || '';
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Tablet/i.test(userAgent);
    const device = isTablet ? 'Tablet' : isMobile ? 'Mobile' : 'Desktop';

    let referrer = params.referrer;
    if (!referrer && document.referrer) {
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

  // --- Export & Delete Account ---
  static exportData(): string {
    return this.exportUserData();
  }

  static exportUserData(): string {
    const user = this.getCurrentUser();
    if (!user || !this.isBrowser()) return '{}';

    const exportBundle = {
      app: 'LinkVM',
      exportedAt: new Date().toISOString(),
      user,
      links: this.getLinks(),
      theme: this.getTheme(),
      socials: this.getSocials(),
      analytics: this.getAnalytics(),
    };

    return JSON.stringify(exportBundle, null, 2);
  }

  static deleteAccount(): boolean {
    const user = this.getCurrentUser();
    if (!user || !this.isBrowser()) return false;

    localStorage.removeItem(`${STORAGE_KEYS.USER_LINKS_PREFIX}${user.id}`);
    localStorage.removeItem(`${STORAGE_KEYS.USER_THEME_PREFIX}${user.id}`);
    localStorage.removeItem(`${STORAGE_KEYS.USER_SOCIALS_PREFIX}${user.id}`);
    localStorage.removeItem(`${STORAGE_KEYS.USER_ANALYTICS_PREFIX}${user.id}`);

    const remainingUsers = this.getAllUsers().filter((u) => u.id !== user.id);
    this.saveAllUsers(remainingUsers);

    this.logout();
    return true;
  }
}

// Data service abstraction layer (swappable to Firebase later with zero UI changes)
export const AuthService = {
  getCurrentUser: () => StorageService.getCurrentUser(),
  isSessionActive: () => StorageService.isSessionActive(),
  signup: async (data: { name: string; email: string; password: string; username?: string }) => {
    return StorageService.signup(data);
  },
  login: async (email: string, password: string, rememberMe = true) => {
    return StorageService.login(email, password, rememberMe);
  },
  logout: async () => {
    StorageService.logout();
    return { success: true };
  },
  checkUsernameAvailable: async (username: string) => {
    return StorageService.checkUsernameAvailable(username);
  },
  changePassword: async (current: string, next: string) => {
    return StorageService.changePassword(current, next);
  },
  updateProfile: async (partial: Partial<User>) => {
    return StorageService.updateProfile(partial);
  },
  deleteAccount: async () => {
    return StorageService.deleteAccount();
  },
  exportData: async () => {
    return StorageService.exportData();
  },
};
