// Utility helpers for alternative URL patterns under dynamic site URL
import { getSiteUrl } from './site';

export interface PatternItem {
  id: string;
  pattern: string; // e.g. "{username}", "@{username}", "${username}", etc.
  label: string;
  example: string;
  description: string;
}

export const PATTERNS: PatternItem[] = [
  {
    id: 'standard',
    pattern: '{username}',
    label: 'Standard',
    example: 'linkvm.online/aimaeditz',
    description: 'Clean direct path',
  },
  {
    id: 'at',
    pattern: '@{username}',
    label: 'At-Symbol (@)',
    example: 'linkvm.online/@aimaeditz',
    description: 'Social handle style',
  },
  {
    id: 'dollar',
    pattern: '${username}',
    label: 'Dollar ($)',
    example: 'linkvm.online/$aimaeditz',
    description: 'Creator / cashtag style',
  },
  {
    id: 'dash',
    pattern: '-{username}',
    label: 'Dash (-)',
    example: 'linkvm.online/-aimaeditz',
    description: 'Minimal prefix',
  },
  {
    id: 'plus',
    pattern: '+{username}',
    label: 'Plus (+)',
    example: 'linkvm.online/+aimaeditz',
    description: 'Positive badge style',
  },
  {
    id: 'exclamation',
    pattern: '!{username}',
    label: 'Exclamation (!)',
    example: 'linkvm.online/!aimaeditz',
    description: 'Bold priority style',
  },
  {
    id: 'tilde',
    pattern: '~{username}',
    label: '~Tilde (~)',
    example: 'linkvm.online/~aimaeditz',
    description: 'Developer / home dir style',
  },
  {
    id: 'subdomain',
    pattern: '{username}.subdomain',
    label: 'Short Subdomain',
    example: 'aimaeditz.linkvm.online',
    description: 'Direct subdomain shortcut',
  },
];

export function normalizeUsername(raw: string): string {
  if (!raw) return '';
  let cleaned = raw.trim();
  try {
    cleaned = decodeURIComponent(cleaned);
  } catch {
    // ignore
  }
  cleaned = cleaned.trim().toLowerCase();

  // Strip leading prefix markers (@, $, -, +, !, ~, #) and any encoded variants repeatedly
  while (cleaned.length > 0) {
    if (['@', '$', '-', '+', '!', '~', '#'].includes(cleaned[0])) {
      cleaned = cleaned.substring(1).trim();
    } else if (cleaned.startsWith('%40')) {
      cleaned = cleaned.substring(3).trim();
    } else if (cleaned.startsWith('%24')) {
      cleaned = cleaned.substring(3).trim();
    } else if (cleaned.startsWith('%2b') || cleaned.startsWith('%2b') || cleaned.startsWith('%2B')) {
      cleaned = cleaned.substring(3).trim();
    } else if (cleaned.startsWith('%21')) {
      cleaned = cleaned.substring(3).trim();
    } else if (cleaned.startsWith('%7e') || cleaned.startsWith('%7E')) {
      cleaned = cleaned.substring(3).trim();
    } else {
      break;
    }
  }

  // Preserve alphanumeric characters, hyphens, and underscores
  return cleaned.replace(/[^a-z0-9_-]/g, '').trim();
}

export function extractUsernameFromUrl(
  pathname: string = typeof window !== 'undefined' ? window.location.pathname : '/',
  hostname: string = typeof window !== 'undefined' ? window.location.hostname : '',
  baseUrl?: string
): { isSubdomain: boolean; username: string } | null {
  // 1. Check Subdomain first
  const hostParts = hostname.toLowerCase().split(':');
  const hostNoPort = hostParts[0];
  const parts = hostNoPort.split('.');

  const isLinkvmSubdomain =
    (hostNoPort.endsWith('.linkvm.online') && parts.length >= 3 && !['www', 'linkvm', 'app', 'api', 'admin', 'auth'].includes(parts[0])) ||
    (hostNoPort.endsWith('.localhost') && parts.length >= 2 && !['www', 'app', 'api'].includes(parts[0]));

  if (isLinkvmSubdomain && parts[0]) {
    const cleanSubdomain = normalizeUsername(parts[0]);
    if (cleanSubdomain) {
      return { isSubdomain: true, username: cleanSubdomain };
    }
  }

  // 2. Check Pathname
  let path = pathname;
  try {
    path = decodeURIComponent(path);
  } catch {
    // ignore
  }

  const envMap = (import.meta as unknown as { env?: Record<string, string | undefined> })?.env;
  const base = (baseUrl || envMap?.BASE_URL || '/').replace(/\/$/, '');
  if (base && base !== '/' && path.startsWith(base)) {
    path = path.slice(base.length);
  }
  if (path.startsWith('/linkvm/')) {
    path = path.slice('/linkvm/'.length);
  } else if (path === '/linkvm') {
    path = '';
  }

  const segments = path.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  if (segments.length === 0) {
    return null;
  }

  const first = segments[0].trim();
  const RESERVED_PATHS = new Set([
    'login',
    'signup',
    'forgot-password',
    'dashboard',
    'why-free',
    'about',
    'contact',
    'privacy',
    'terms',
    'invite',
    '404',
    'index.html',
    'r',
    'assets',
    'api',
    'favicon.ico',
    'robots.txt',
    'sitemap.xml',
    'manifest.json',
  ]);

  if (RESERVED_PATHS.has(first.toLowerCase())) {
    return null;
  }

  const clean = normalizeUsername(first);
  if (!clean) return null;

  return { isSubdomain: false, username: clean };
}

export function buildPatternUrl(pattern: string | undefined, username: string, baseUrl?: string): string {
  const cleanUsername = normalizeUsername(username) || 'username';
  const siteUrl = (baseUrl || getSiteUrl()).replace(/\/$/, '');

  if (pattern === '{username}.subdomain' || pattern === 'subdomain') {
    try {
      const urlObj = new URL(siteUrl);
      if (!urlObj.pathname || urlObj.pathname === '/') {
        return `${urlObj.protocol}//${cleanUsername}.${urlObj.host}`;
      }
    } catch {
      // fallback
    }
    return `${siteUrl}/${cleanUsername}`;
  }

  const activePattern = pattern || '{username}';
  const formattedPath = activePattern.replace('{username}', cleanUsername);
  return `${siteUrl}/${formattedPath}`;
}

export function buildPatternDisplayUrl(pattern: string | undefined, username: string, baseUrl?: string): string {
  const full = buildPatternUrl(pattern, username, baseUrl);
  return full.replace(/^https?:\/\//, '');
}

