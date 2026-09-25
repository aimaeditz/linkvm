export const RESERVED_USERNAMES = new Set([
  'admin',
  'administrator',
  'api',
  'auth',
  'login',
  'signup',
  'register',
  'logout',
  'dashboard',
  'settings',
  'profile',
  'account',
  'help',
  'support',
  'root',
  'system',
  'null',
  'undefined',
  'true',
  'false',
  'pricing',
  'why-free',
  'about',
  'contact',
  'privacy',
  'terms',
  'faq',
  'analytics',
  'links',
  'appearance',
  'qr-code',
  'changelog',
  'linkvm',
  'official',
  'security',
  'status',
  'billing',
]);

export function isReservedUsername(username: string): boolean {
  return RESERVED_USERNAMES.has(username.trim().toLowerCase());
}

export function validateUsername(username: string): { valid: boolean; error?: string } {
  const trimmed = username.trim().toLowerCase();
  
  if (trimmed.length < 3 || trimmed.length > 30) {
    return { valid: false, error: 'Username must be between 3 and 30 characters.' };
  }

  if (!/^[a-z0-9_-]+$/.test(trimmed)) {
    return { valid: false, error: 'Only lowercase letters, numbers, dashes, and underscores.' };
  }

  if (/^[-_]|[-_]$/.test(trimmed)) {
    return { valid: false, error: 'Username cannot start or end with a dash or underscore.' };
  }

  if (isReservedUsername(trimmed)) {
    return { valid: false, error: 'This username is reserved.' };
  }

  return { valid: true };
}
