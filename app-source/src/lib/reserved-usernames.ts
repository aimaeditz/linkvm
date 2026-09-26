const RESERVED_LIST = new Set([
  'admin',
  'administrator',
  'dashboard',
  'login',
  'signup',
  'forgot-password',
  'api',
  'app',
  'linkvm',
  'settings',
  'help',
  'about',
  'contact',
  'terms',
  'privacy',
  'why-free',
  'r',
  'invite',
  'assets',
  'favicon.ico',
  'manifest.json',
  'index.html',
  '404',
  'overview',
  'links',
  'appearance',
  'analytics',
  'qrcode',
  'guide',
]);

export function isReservedUsername(username: string): boolean {
  return RESERVED_LIST.has(username.toLowerCase().trim());
}

export function validateUsername(username: string): { valid: boolean; error?: string } {
  const clean = username.trim().toLowerCase();
  if (!clean) return { valid: false, error: 'Username is required.' };
  if (clean.length < 3) return { valid: false, error: 'Username must be at least 3 characters.' };
  if (clean.length > 30) return { valid: false, error: 'Username must be 30 characters or less.' };
  if (!/^[a-z0-9_-]+$/.test(clean)) return { valid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens.' };
  return { valid: true };
}
